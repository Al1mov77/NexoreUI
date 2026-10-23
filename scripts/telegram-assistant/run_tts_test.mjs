import { synthesizeSpeech } from "./edge_tts.mjs";
import fs from "fs";

async function run() {
  const file = "scripts/telegram-assistant/dmitry_test.mp3";
  await synthesizeSpeech("Умар, привет! Это тест уверенного мужского голоса Дмитрия. Теперь звучит солидно и чётко.", file);
  console.log("Audio generated successfully! Bytes:", fs.statSync(file).size);
}

run().catch(console.error);
