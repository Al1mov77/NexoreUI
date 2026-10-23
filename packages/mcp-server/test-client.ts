import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as path from "path";

async function run() {
  const serverDistPath = path.resolve(__dirname, "./dist/index.js");
  console.log(`Connecting to MCP Server at: ${serverDistPath}...`);

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverDistPath],
  });

  const client = new Client(
    {
      name: "test-client",
      version: "2.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log("Handshake successful!");

  console.log("\n--- 1. listTools ---");
  const toolsResponse = await client.listTools();
  console.log(
    "Registered Tools:",
    toolsResponse.tools.map((t) => t.name)
  );

  console.log("\n--- 2. list_components ---");
  const listComponentsRes = await client.callTool({
    name: "list_components",
    arguments: {},
  });
  const compList = JSON.parse((listComponentsRes.content as any)[0].text);
  console.log(`Found ${compList.length} components dynamically from registry.`);
  console.log(`First component: ${compList[0]?.name} (${compList[0]?.category})`);

  console.log("\n--- 3. get_component_code (Valid Component) ---");
  const codeResValid = await client.callTool({
    name: "get_component_code",
    arguments: { componentName: "button" },
  });
  const buttonData = JSON.parse((codeResValid.content as any)[0].text);
  console.log(
    `Button code fetched: length = ${buttonData.code.length} chars, dependencies = ${buttonData.dependencies.join(", ")}`
  );

  console.log("\n--- 4. get_component_code (Invalid Component with Suggestions) ---");
  const codeResInvalid = await client.callTool({
    name: "get_component_code",
    arguments: { componentName: "FooBarIcon" },
  });
  console.log(
    "Invalid Component Response (isError):",
    codeResInvalid.isError,
    (codeResInvalid.content as any)[0].text
  );

  console.log("\n--- 5. generate_snippet (Valid React Snippet) ---");
  const generateValid = await client.callTool({
    name: "generate_snippet",
    arguments: {
      componentName: "button",
      props: {
        variant: "outline",
        children: "Click me",
      },
    },
  });
  console.log("Generated React Snippet:\n" + (generateValid.content as any)[0].text);

  console.log("\n--- 6. generate_snippet (Edge Case: Unsupported Framework) ---");
  const generateFrameworkInvalid = await client.callTool({
    name: "generate_snippet",
    arguments: {
      componentName: "button",
      framework: "vue",
      props: {},
    },
  });
  console.log(
    "Unsupported Framework Response (isError):",
    generateFrameworkInvalid.isError,
    (generateFrameworkInvalid.content as any)[0].text
  );

  console.log("\n--- 7. list_templates (Pro Metadata Only) ---");
  const listTemplatesRes = await client.callTool({
    name: "list_templates",
    arguments: {},
  });
  const tplList = JSON.parse((listTemplatesRes.content as any)[0].text);
  console.log(`Found ${tplList.length} Pro templates dynamically from registry.`);
  console.log(`First template metadata:`, tplList[0]);
  if (tplList[0]?.content !== undefined) {
    throw new Error("Security violation: Template content leaked in list_templates!");
  }

  console.log("\n--- 8. get_template_code (Pro License Guard) ---");
  const tplCodeRes = await client.callTool({
    name: "get_template_code",
    arguments: { templateSlug: "chrono-x-pro" },
  });
  const tplResponseText = (tplCodeRes.content as any)[0].text;
  console.log(`Response text: "${tplResponseText}"`);

  // Assertions: response must NOT contain code, and MUST contain license instructions
  if (tplResponseText.includes("import ") || tplResponseText.includes("export default")) {
    throw new Error("Security violation: Template code leaked in get_template_code!");
  }
  if (!tplResponseText.includes("NexoreUI Pro license required")) {
    throw new Error("Assertion failed: Response missing Pro license required notice!");
  }
  if (!tplResponseText.includes("npx nexoreui add template-chrono-x-pro")) {
    throw new Error("Assertion failed: Response missing exact CLI add command!");
  }
  console.log("✔ get_template_code security assertions passed: no code leaked, license notice present.");

  console.log("\n--- 9. MCP Resources (Including Protected Template Resource) ---");
  const resourcesRes = await client.listResources();
  console.log(`Total declared resources: ${resourcesRes.resources.length}`);

  const themeResource = await client.readResource({ uri: "nexore://theme" });
  console.log(
    `Resource 'nexore://theme': mime = ${themeResource.contents[0].mimeType}, length = ${themeResource.contents[0].text?.length} chars`
  );

  const compResource = await client.readResource({ uri: "nexore://components/rating" });
  console.log(
    `Resource 'nexore://components/rating': length = ${compResource.contents[0].text?.length} chars`
  );

  const tplResource = await client.readResource({ uri: "nexore://templates/chrono-x-pro" });
  const tplResourceText = tplResource.contents[0].text || "";
  console.log(`Resource 'nexore://templates/chrono-x-pro' text: "${tplResourceText}"`);
  if (tplResourceText.includes("import ") || tplResourceText.includes("export default")) {
    throw new Error("Security violation: Template code leaked in resource nexore://templates/chrono-x-pro!");
  }
  if (!tplResourceText.includes("NexoreUI Pro license required")) {
    throw new Error("Assertion failed: Template resource missing license notice!");
  }
  console.log("✔ Template resource security assertions passed: no code leaked.");

  console.log("\n--- 10. MCP Prompts ---");
  const promptsRes = await client.listPrompts();
  console.log("Registered Prompts:", promptsRes.prompts.map((p) => p.name));

  const addCompPrompt = await client.getPrompt({
    name: "add-component",
    arguments: { componentName: "rating" },
  });
  console.log("Prompt 'add-component' description:", addCompPrompt.description);

  const scaffoldPrompt = await client.getPrompt({
    name: "scaffold-page",
    arguments: { pageType: "dashboard" },
  });
  console.log("Prompt 'scaffold-page' description:", scaffoldPrompt.description);

  await client.close();
  console.log("\nALL TESTS PASSED SUCCESSFULLY (10/10)!");
  process.exit(0);
}

run().catch((err) => {
  console.error("Test client error:", err);
  process.exit(1);
});
