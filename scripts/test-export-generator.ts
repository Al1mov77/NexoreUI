import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  prepareSpec,
  DEMO_SPEC,
  buildFormModel,
  defaultSettings,
  resolveFields,
  generateComponentSource,
  generateCurlScript,
} from "../apps/docs/app/components/templates/sources/SwaggerFormBuilder";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../apps/docs/app/test-generated");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function main() {
  console.log("Loading demo spec...");
  const spec = await prepareSpec(DEMO_SPEC, "https://api.northwind.example/openapi.json", true);
  console.log(`Loaded ${spec.endpoints.length} endpoints.`);

  const postEndpoints = spec.endpoints.filter((e) => e.method === "post");
  console.log(`Found ${postEndpoints.length} POST endpoints.`);

  for (const endpoint of postEndpoints) {
    console.log(`\nTesting endpoint: POST ${endpoint.path}`);
    const model = buildFormModel(endpoint);
    const settings = defaultSettings(model);
    const fields = resolveFields(model, settings);

    console.log(`  Mapped ${fields.length} fields:`);
    for (const f of fields) {
      console.log(`    - ${f.ident} (${f.kind}, required=${f.required}, source=${f.source})`);
    }

    if (model.skipped.length > 0) {
      console.log(`  Skipped ${model.skipped.length} unsupported/complex fields:`);
      for (const s of model.skipped) {
        console.log(`    - ${s.name}: ${s.reason}`);
      }
    }

    // 1. Generate Fetch component
    const fetchCode = generateComponentSource({
      model,
      spec,
      fields,
      columns: 2,
      transport: "fetch",
      useClient: true,
    });
    const fetchFileName = path.join(outputDir, `Form_${endpoint.id.replace(/[^a-zA-Z0-9]/g, "_")}_Fetch.tsx`);
    fs.writeFileSync(fetchFileName, fetchCode, "utf8");
    console.log(`  Wrote Fetch component to: ${fetchFileName}`);

    // 2. Generate Axios component
    const axiosCode = generateComponentSource({
      model,
      spec,
      fields,
      columns: 1,
      transport: "axios",
      useClient: true,
    });
    const axiosFileName = path.join(outputDir, `Form_${endpoint.id.replace(/[^a-zA-Z0-9]/g, "_")}_Axios.tsx`);
    fs.writeFileSync(axiosFileName, axiosCode, "utf8");
    console.log(`  Wrote Axios component to: ${axiosFileName}`);

    // 3. Generate cURL script
    const curlCode = generateCurlScript(model, spec, fields);
    const curlFileName = path.join(outputDir, `curl_${endpoint.id.replace(/[^a-zA-Z0-9]/g, "_")}.sh`);
    fs.writeFileSync(curlFileName, curlCode, "utf8");
    console.log(`  Wrote cURL script to: ${curlFileName}`);
  }

  console.log("\nAll components generated successfully!");
}

main().catch((err) => {
  console.error("Error in test-export-generator:", err);
  process.exit(1);
});
