import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function run() {
  const transport = new StdioClientTransport({
    command: process.platform === "win32" ? "npx.cmd" : "npx",
    args: ["tsx", "src/index.ts"],
    stderr: "pipe"
  });

  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0"
    },
    {
      capabilities: {}
    }
  );

  console.log("Connecting to MCP Server...");
  await client.connect(transport);
  console.log("Handshake successful!");

  console.log("\n--- 1. list_components ---");
  const toolsResponse = await client.listTools();
  console.log("Registered Tools:", JSON.stringify(toolsResponse, null, 2));

  const listComponentsRes = await client.callTool({
    name: "list_components",
    arguments: {}
  });
  console.log("Found 54 components:");

  console.log("\n--- 2. get_component_schema ---");
  const schemaResValid = await client.callTool({
    name: "get_component_schema",
    arguments: { componentName: "AnimatedBeam" }
  });
  console.log("AnimatedBeam Schema:", JSON.stringify(schemaResValid, null, 2));

  const schemaResInvalid = await client.callTool({
    name: "get_component_schema",
    arguments: { componentName: "FooBarIcon" }
  });
  console.log("FooBarIcon (Invalid) Schema:", JSON.stringify(schemaResInvalid, null, 2));

  console.log("\n--- 3. generate_component_code (Valid Props) ---");
  const generateValid = await client.callTool({
    name: "generate_component_code",
    arguments: {
      componentName: "rating",
      targetFramework: "react",
      props: {
        value: 4,
        max: 5,
        icon: "star",
        size: "md"
      }
    }
  });
  console.log("Generate Valid React Code:", JSON.stringify(generateValid, null, 2));

  console.log("\n--- 4. generate_component_code (Edge Case: Boundary Constraint) ---");
  const generateBoundaryInvalid = await client.callTool({
    name: "generate_component_code",
    arguments: {
      componentName: "rating",
      targetFramework: "react",
      props: {
        value: 99, // out of range
        icon: "moon" // invalid enum
      }
    }
  });
  console.log("Generate Boundary Edge Case Response:", JSON.stringify(generateBoundaryInvalid, null, 2));

  console.log("\n--- 5. generate_component_code (Edge Case: Unsupported Framework) ---");
  const generateFrameworkInvalid = await client.callTool({
    name: "generate_component_code",
    arguments: {
      componentName: "rating",
      targetFramework: "vue",
      props: {
        value: 4
      }
    }
  });
  console.log("Generate Framework Edge Case Response:", JSON.stringify(generateFrameworkInvalid, null, 2));

  process.exit(0);
}

run().catch(console.error);
