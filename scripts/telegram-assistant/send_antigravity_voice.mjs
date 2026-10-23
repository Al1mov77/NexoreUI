import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "fs";

async function main() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("ru-RU-DmitryNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const filePath = "scripts/telegram-assistant/antigravity_voice.mp3";
  await tts.toFile(filePath, "Умар, на связи Antigravity. Голос настроен. Система на боевом дежурстве. Доступ закрыт для всех, кроме тебя. Жду твоих указаний.");
  console.log("Success! File size:", fs.statSync(filePath).size);

  const audioBuf = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append("chat_id", "6896967270");
  formData.append("voice", new Blob([audioBuf], { type: "audio/mpeg" }), "antigravity.mp3");
  formData.append("caption", "🎙 Antigravity на связи. Система на дежурстве.");

  const tgRes = await fetch("https://api.telegram.org/bot8598766533:AAF4C-sB9bdl2ohQLxS05W-QRqWvQFs-shw/sendVoice", {
    method: "POST",
    body: formData
  });
  const data = await tgRes.json();
  console.log("Sent to Telegram:", data.ok, data.result?.message_id);
}

main().catch(console.error);
