import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "fs";

async function main() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("ru-RU-DmitryNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const filePath = "scripts/telegram-assistant/dmitry_voice.mp3";
  await tts.toFile(filePath, "Умар, привет! Голос обновлен. Теперь говорит уверенный мужской ассистент. Доступ заблокирован для всех посторонних, слушаю только твои команды.");
  console.log("Success! File size:", fs.statSync(filePath).size);
}

main().catch(console.error);
