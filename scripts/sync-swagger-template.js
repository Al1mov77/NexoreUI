const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../apps/docs/app/components/templates/sources/SwaggerFormBuilder.tsx');
const destPath = path.join(__dirname, '../packages/cli/src/registry/template-swagger-form-builder.ts');

const content = fs.readFileSync(sourcePath, 'utf8');

const fileContent = `export const templateSwaggerFormBuilder = {
  name: "template-swagger-form-builder",
  dependencies: [
    "framer-motion",
    "lucide-react",
    "react-hook-form",
    "@hookform/resolvers",
    "zod",
    "@apidevtools/json-schema-ref-parser",
    "yaml"
  ],
  fileName: "template-swagger-form-builder.tsx",
  content: ${JSON.stringify(content)}
};
`;

fs.writeFileSync(destPath, fileContent, 'utf8');
console.log('Successfully synced template-swagger-form-builder.ts');
