import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
// CommonJS already has __dirname and __filename

// Import the real codeGenerator
import {
  generateReactCode,
  generateVueCode,
  generateHTMLCode,
} from "../../../apps/docs/app/nexoremake/utils/codeGenerator.js";

const server = new Server(
  {
    name: "nexore-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const COMPONENTS_DIR = path.resolve(
  __dirname,
  "../../../packages/ui/src/components"
);

function getAllComponents() {
  const files = fs.readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".tsx"));
  return files.map((file) => {
    const name = file.replace(".tsx", "");
    const content = fs.readFileSync(path.join(COMPONENTS_DIR, file), "utf-8");
    let category = "base";
    if (file.startsWith("pro-")) category = "pro-block";
    else if (file.includes("anim") || file.includes("effect") || file.includes("meteor") || file.includes("magic") || file.includes("beam")) category = "animated";
    
    const interfaceMatch = content.match(/interface\s+([A-Za-z0-9_]+Props)/);
    
    return {
      name,
      fileName: file,
      category,
      interfaceName: interfaceMatch ? interfaceMatch[1] : "Unknown",
    };
  });
}

function parsePropsSchema(componentName: string) {
  let content = "";
  // Attempt direct file match, convert PascalCase to kebab-case
  const kebabName = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const directPath = path.join(COMPONENTS_DIR, `${kebabName}.tsx`);
  
  if (fs.existsSync(directPath)) {
    content = fs.readFileSync(directPath, "utf-8");
  } else {
    // Search in all files for the interface
    const files = fs.readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith(".tsx"));
    for (const file of files) {
      const fileContent = fs.readFileSync(path.join(COMPONENTS_DIR, file), "utf-8");
      if (fileContent.includes(`interface ${componentName}Props`)) {
        content = fileContent;
        break;
      }
    }
  }

  if (!content) {
    return null;
  }
  
  const interfaceRegex = new RegExp(`interface\\s+${componentName}Props[^\\{]*\\{([\\s\\S]*?)\\}`);
  const match = content.match(interfaceRegex);
  
  if (!match) return { type: "object", properties: {} };
  
  const propsBody = match[1];
  const properties: any = {};
  
  const propRegex = /([a-zA-Z0-9_]+)(\??)\s*:\s*([^;\n]+)/g;
  let propMatch;
  while ((propMatch = propRegex.exec(propsBody)) !== null) {
    const [_, name, optional, typeStr] = propMatch;
    let type = "string";
    const cleanType = typeStr.trim().replace(/\n/g, "");
    
    let enumValues;
    if (cleanType.includes('"') || cleanType.includes("'")) {
      type = "string";
      enumValues = cleanType.split("|").map(s => s.trim().replace(/['"]/g, ""));
    } else if (cleanType === "number") {
      type = "number";
    } else if (cleanType === "boolean") {
      type = "boolean";
    }
    
    properties[name] = {
      type,
      optional: optional === "?",
      description: `Type: ${cleanType}`,
      ...(enumValues ? { enum: enumValues } : {})
    };
  }
  
  return { type: "object", properties };
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_components",
        description: "List all NexoreUI components available in the library",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_component_schema",
        description: "Get the property schema for a specific component",
        inputSchema: {
          type: "object",
          properties: {
            componentName: { type: "string" },
          },
          required: ["componentName"],
        },
      },
      {
        name: "generate_component_code",
        description: "Generate code (JSX/Vue/HTML) for a component using Nexore Make codeGenerator",
        inputSchema: {
          type: "object",
          properties: {
            componentName: { type: "string" },
            props: { type: "object", additionalProperties: true },
            targetFramework: { type: "string", enum: ["react", "vue", "html"] },
          },
          required: ["componentName", "props", "targetFramework"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (request.params.name === "list_components") {
      const components = getAllComponents();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(components, null, 2),
          },
        ],
      };
    }

    if (request.params.name === "get_component_schema") {
      const name = String(request.params.arguments?.componentName);
      const schema = parsePropsSchema(name);
      
      if (!schema) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: Component '${name}' not found in registry.`,
            },
          ],
        };
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(schema, null, 2),
          },
        ],
      };
    }

    if (request.params.name === "generate_component_code") {
      const args = request.params.arguments;
      const componentName = String(args?.componentName);
      const props = args?.props as Record<string, any>;
      const targetFramework = String(args?.targetFramework);

      if (targetFramework === "vue" || targetFramework === "html") {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: framework not supported yet. Only 'react' is fully supported by the code generator.`,
            },
          ],
        };
      }
      
      const schema = parsePropsSchema(componentName);
      if (!schema) {
        return {
          isError: true,
          content: [{ type: "text", text: `Component not found: ${componentName}` }],
        };
      }
      
      const errors = [];
      for (const [key, pDef] of Object.entries(schema.properties as any)) {
        const propDef = pDef as any;
        if (!propDef.optional && props[key] === undefined) {
          errors.push(`Missing mandatory prop: ${key}`);
        }
        if (props[key] !== undefined && propDef.enum && !propDef.enum.includes(props[key])) {
          errors.push(`Invalid enum value for prop '${key}'. Expected one of: ${propDef.enum.join(", ")}`);
        }
        if (props[key] !== undefined && propDef.type === "number" && typeof props[key] !== "number") {
            errors.push(`Invalid type for prop '${key}'. Expected number.`);
        }
      }
      
      if (componentName === "rating" && props.value !== undefined) {
          const max = props.max !== undefined ? props.max : 5;
          if (props.value > max || props.value < 0) {
              errors.push(`Validation Error: value (${props.value}) is out of range. Must be between 0 and ${max}.`);
          }
      }

      if (errors.length > 0) {
        return {
          isError: true,
          content: [{ type: "text", text: `Validation errors:\n${errors.join("\n")}` }],
        };
      }

      const element: any = {
        id: `el-${Date.now()}`,
        type: componentName,
        name: componentName,
        position: { x: 0, y: 0 },
        size: { width: "auto", height: "auto" },
        zIndex: 1,
        styles: {},
        ...props,
      };

      const settings = {
        width: 800,
        height: 600,
        backgroundColor: "#ffffff",
        gridVisible: false,
        zoom: 1,
      };

      let code = "";
      if (targetFramework === "react") {
        code = generateReactCode([element], settings);
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

    throw new Error("Unknown tool");
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

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Nexore Make MCP Server running on stdio");
}

run().catch(console.error);
