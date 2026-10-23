#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

function loadSnapshot() {
  const localSnapshot = path.resolve(__dirname, "./registry-snapshot.json");
  const srcSnapshot = path.resolve(__dirname, "../src/registry-snapshot.json");
  const targetPath = fs.existsSync(localSnapshot)
    ? localSnapshot
    : fs.existsSync(srcSnapshot)
    ? srcSnapshot
    : null;

  if (!targetPath) {
    throw new Error("registry-snapshot.json not found");
  }
  return JSON.parse(fs.readFileSync(targetPath, "utf-8"));
}

const snapshot = loadSnapshot();

const server = new Server(
  {
    name: "nexore-mcp-server",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

function findComponent(name: string) {
  if (!name) return null;
  const raw = String(name).trim();
  const kebab = raw.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

  if (snapshot.components[raw]) return snapshot.components[raw];
  if (snapshot.components[kebab]) return snapshot.components[kebab];
  if (snapshot.aliases[raw] && snapshot.components[snapshot.aliases[raw]]) {
    return snapshot.components[snapshot.aliases[raw]];
  }
  if (snapshot.aliases[kebab] && snapshot.components[snapshot.aliases[kebab]]) {
    return snapshot.components[snapshot.aliases[kebab]];
  }

  const lowerRaw = raw.toLowerCase();
  for (const [key, val] of Object.entries<any>(snapshot.components)) {
    if (key.toLowerCase() === lowerRaw || key.toLowerCase() === kebab) {
      return val;
    }
  }

  return null;
}

function findTemplate(slugOrName: string) {
  if (!slugOrName) return null;
  const raw = String(slugOrName).trim();
  const withPrefix = raw.startsWith("template-") ? raw : `template-${raw}`;
  const withoutPrefix = raw.replace(/^template-/, "");

  if (snapshot.templates[raw]) return snapshot.templates[raw];
  if (snapshot.templates[withPrefix]) return snapshot.templates[withPrefix];

  const lowerRaw = raw.toLowerCase();
  const lowerWithPrefix = withPrefix.toLowerCase();
  const lowerWithoutPrefix = withoutPrefix.toLowerCase();

  for (const [key, val] of Object.entries<any>(snapshot.templates)) {
    const k = key.toLowerCase();
    const kWithout = k.replace(/^template-/, "");
    if (k === lowerRaw || k === lowerWithPrefix || kWithout === lowerWithoutPrefix) {
      return val;
    }
  }
  return null;
}

function getCloseMatches(name: string, list: string[], max = 5): string[] {
  const q = name.toLowerCase();
  return list
    .filter((item) => item.toLowerCase().includes(q) || q.includes(item.toLowerCase()))
    .slice(0, max);
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_components",
        description: "List all NexoreUI components available in the library with their category and dependencies",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_component_code",
        description: "Get full source code and npm dependencies for a specific NexoreUI component",
        inputSchema: {
          type: "object",
          properties: {
            componentName: { type: "string", description: "Name of the component (e.g. 'button', 'card', 'rating')" },
          },
          required: ["componentName"],
        },
      },
      {
        name: "generate_snippet",
        description: "Generate clean JSX/TSX React snippet for using a NexoreUI component with props",
        inputSchema: {
          type: "object",
          properties: {
            componentName: { type: "string", description: "Name of the component" },
            props: { type: "object", additionalProperties: true, description: "Component props" },
            framework: { type: "string", description: "Target framework (only 'react' is supported)", default: "react" },
          },
          required: ["componentName"],
        },
      },
      {
        name: "list_templates",
        description: "List all Pro templates available in NexoreUI with their slug, dependencies, and Pro status",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_template_code",
        description: "Get license and installation instructions for a NexoreUI Pro template",
        inputSchema: {
          type: "object",
          properties: {
            templateSlug: { type: "string", description: "Slug or name of the template (e.g. 'chrono-x-pro' or 'template-chrono-x-pro')" },
          },
          required: ["templateSlug"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "list_components") {
      const componentsList = Object.values<any>(snapshot.components).map((c) => ({
        name: c.name,
        fileName: c.fileName,
        category: c.category,
        dependencies: c.dependencies,
        devDependencies: c.devDependencies || [],
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(componentsList, null, 2),
          },
        ],
      };
    }

    if (request.params.name === "get_component_code") {
      const name = String(request.params.arguments?.componentName);
      const comp = findComponent(name);

      if (!comp) {
        const componentNames = Object.keys(snapshot.components);
        const suggestions = getCloseMatches(name, componentNames);
        const suggestionMsg =
          suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: Component '${name}' not found in registry.${suggestionMsg}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                name: comp.name,
                fileName: comp.fileName,
                category: comp.category,
                dependencies: comp.dependencies,
                devDependencies: comp.devDependencies,
                code: comp.content,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    if (request.params.name === "generate_snippet") {
      const args = request.params.arguments;
      const componentName = String(args?.componentName);
      const props = (args?.props as Record<string, any>) || {};
      const framework = String(args?.framework || "react").toLowerCase();

      if (framework !== "react") {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: framework '${framework}' is not supported. Only 'react' is supported.`,
            },
          ],
        };
      }

      const comp = findComponent(componentName);
      if (!comp) {
        const componentNames = Object.keys(snapshot.components);
        const suggestions = getCloseMatches(componentName, componentNames);
        const suggestionMsg =
          suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: Component '${componentName}' not found in registry.${suggestionMsg}`,
            },
          ],
        };
      }

      const { children, ...restProps } = props;
      const propEntries = Object.entries(restProps)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => {
          if (typeof v === "string") return `${k}="${v}"`;
          if (typeof v === "boolean") return v ? k : `${k}={false}`;
          return `${k}={${JSON.stringify(v)}}`;
        });
      const propsString = propEntries.length > 0 ? ` ${propEntries.join(" ")}` : "";
      const pascalName = comp.name
        .split("-")
        .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");

      let code = "";
      if (children !== undefined && children !== null && children !== "") {
        code = `import { ${pascalName} } from "@/components/ui/${comp.name}";\n\nexport function Example() {\n  return (\n    <${pascalName}${propsString}>\n      ${children}\n    </${pascalName}>\n  );\n}`;
      } else {
        code = `import { ${pascalName} } from "@/components/ui/${comp.name}";\n\nexport function Example() {\n  return (\n    <${pascalName}${propsString} />\n  );\n}`;
      }

      return {
        content: [
          {
            type: "text",
            text: code,
          },
        ],
      };
    }

    if (request.params.name === "list_templates") {
      const templatesList = Object.values<any>(snapshot.templates).map((t) => ({
        name: t.name,
        slug: t.slug || t.name.replace(/^template-/, ""),
        fileName: t.fileName,
        dependencies: t.dependencies,
        devDependencies: t.devDependencies || [],
        pro: true,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(templatesList, null, 2),
          },
        ],
      };
    }

    if (request.params.name === "get_template_code") {
      const slugOrName = String(request.params.arguments?.templateSlug || "");
      const tpl = findTemplate(slugOrName);

      if (!tpl) {
        const templateSlugs = Object.keys(snapshot.templates).map((k) =>
          k.replace(/^template-/, "")
        );
        const suggestions = getCloseMatches(slugOrName, templateSlugs);
        const suggestionMsg =
          suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: Template '${slugOrName}' not found in registry.${suggestionMsg}`,
            },
          ],
        };
      }

      const templateName = tpl.name;
      const responseText = `NexoreUI Pro license required. Templates are available for Pro users only. To install this template, run "npx nexoreui add ${templateName}" with a valid Pro license. Pricing: https://www.nexoreui.site/pricing`;

      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: error.message || String(error),
        },
      ],
    };
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources: any[] = [];

  if (snapshot.theme) {
    resources.push({
      uri: "nexore://theme",
      name: "NexoreUI Theme Configuration",
      description: "Tailwind CSS v4 theme variables and styles (globals.css)",
      mimeType: "text/css",
    });
  }

  for (const comp of Object.values<any>(snapshot.components)) {
    resources.push({
      uri: `nexore://components/${comp.name}`,
      name: `${comp.name} Component`,
      description: `Source code for NexoreUI ${comp.name} component (${comp.category})`,
      mimeType: "text/typescript",
    });
  }

  for (const tpl of Object.values<any>(snapshot.templates)) {
    const slug = tpl.slug || tpl.name.replace(/^template-/, "");
    resources.push({
      uri: `nexore://templates/${slug}`,
      name: `${slug} Template (Pro)`,
      description: `License and installation metadata for NexoreUI Pro template '${slug}'`,
      mimeType: "text/plain",
    });
  }

  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === "nexore://theme") {
    if (!snapshot.theme) {
      throw new Error("Theme configuration (globals.css) is not available in snapshot.");
    }
    return {
      contents: [
        {
          uri: "nexore://theme",
          mimeType: "text/css",
          text: snapshot.theme,
        },
      ],
    };
  }

  const compMatch = uri.match(/^nexore:\/\/components\/(.+)$/);
  if (compMatch) {
    const name = compMatch[1];
    const comp = findComponent(name);
    if (!comp) {
      throw new Error(`Component '${name}' not found.`);
    }
    return {
      contents: [
        {
          uri,
          mimeType: "text/typescript",
          text: comp.content,
        },
      ],
    };
  }

  const tplMatch = uri.match(/^nexore:\/\/templates\/(.+)$/);
  if (tplMatch) {
    const slug = tplMatch[1];
    const tpl = findTemplate(slug);
    if (!tpl) {
      throw new Error(`Template '${slug}' not found.`);
    }
    const templateName = tpl.name;
    const textContent = `NexoreUI Pro license required. Templates are available for Pro users only. To install this template, run "npx nexoreui add ${templateName}" with a valid Pro license. Pricing: https://www.nexoreui.site/pricing`;

    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: textContent,
        },
      ],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
});

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "add-component",
        description: "Guide for installing and using a NexoreUI component in a project",
        arguments: [
          {
            name: "componentName",
            description: "Name of the NexoreUI component (e.g. 'button', 'card', 'blur-fade')",
            required: true,
          },
        ],
      },
      {
        name: "scaffold-page",
        description: "Guidelines and recommended components for scaffolding a complete page with NexoreUI",
        arguments: [
          {
            name: "pageType",
            description: "Type of page to scaffold (e.g. 'landing', 'dashboard', 'auth', 'ecommerce', 'settings')",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const promptName = request.params.name;
  const args = request.params.arguments || {};

  if (promptName === "add-component") {
    const compName = String(args.componentName || "button");
    const comp = findComponent(compName);

    if (!comp) {
      const suggestions = getCloseMatches(compName, Object.keys(snapshot.components));
      const msg = suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";
      throw new Error(`Component '${compName}' not found.${msg}`);
    }

    const depsList =
      comp.dependencies && comp.dependencies.length > 0
        ? comp.dependencies.join(" ")
        : "no extra dependencies";

    return {
      description: `How to install and use ${comp.name} in your NexoreUI project`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `I want to add the '${comp.name}' component to my project.\n\nComponent Information:\n- Name: ${comp.name}\n- Category: ${comp.category}\n- NPM Dependencies: ${depsList}\n- File Name: ${comp.fileName}\n\nComponent Source Code:\n\`\`\`tsx\n${comp.content}\n\`\`\`\n\nPlease guide me on:\n1. Installing required dependencies\n2. Creating the component file at components/ui/${comp.fileName}\n3. Providing an example of how to use <${comp.name.charAt(0).toUpperCase() + comp.name.slice(1)} /> in a page with Tailwind CSS.`,
          },
        },
      ],
    };
  }

  if (promptName === "scaffold-page") {
    const pageType = String(args.pageType || "landing");

    return {
      description: `Scaffolding a ${pageType} page with NexoreUI`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `I want to scaffold a modern, high-craft ${pageType} page using NexoreUI components.\n\nAvailable categories in NexoreUI:\n- Base UI: button, card, input, dialog, tabs, table, select, badge, avatar, tooltip...\n- Animated: animated-beam, blur-fade, marquee, number-ticker, aurora-border-card...\n- Pro Blocks: pro-dashboards, pro-tables, pro-forms, pro-marketing...\n\nPlease propose a clean layout and full TypeScript React code using NexoreUI components and Tailwind CSS tokens.`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${promptName}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Nexore Make MCP Server running on stdio");
}

run().catch(console.error);
