import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../src/registry-snapshot.json");
const dist = path.resolve(__dirname, "../dist/registry-snapshot.json");

if (fs.existsSync(src)) {
  const distDir = path.dirname(dist);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.copyFileSync(src, dist);
  console.log("Snapshot successfully synced to dist/registry-snapshot.json");
}
