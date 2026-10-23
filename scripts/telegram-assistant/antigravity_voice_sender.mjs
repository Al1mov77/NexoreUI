import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import fs from "fs";
import path from "path";

const BOT_TOKEN = "8598766533:AAF4C-sB9bdl2ohQLxS05W-QRqWvQFs-shw";
const ALLOWED_CHAT_ID = 6896967270;
const ALLOWED_USERNAME = "alimovv77u";

export async function generateVoice(text, outputFile) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata("ru-RU-DmitryNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  const out = fs.createWriteStream(outputFile);
  audioStream.pipe(out);
  return new Promise((resolve, reject) => {
    out.on("finish", () => resolve(outputFile));
    audioStream.on("error", reject);
    out.on("error", reject);
  });
}

export async function sendVoiceMessage(chatId, text, caption = "") {
  if (Number(chatId) !== ALLOWED_CHAT_ID) {
    console.error("SECURITY ALERT: Unauthorized chat ID rejected:", chatId);
    return false;
  }
  const tempFile = path.resolve("scripts/telegram-assistant/voice_msg.mp3");
  await generateVoice(text, tempFile);

  const audioBuf = fs.readFileSync(tempFile);
  const formData = new FormData();
  formData.append("chat_id", String(chatId));
  formData.append("voice", new Blob([audioBuf], { type: "audio/mpeg" }), "voice.mp3");
  if (caption) {
    formData.append("caption", caption);
  }

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  return data.ok;
}

// Send test
(async () => {
  console.log("Generating confident Antigravity voice message...");
  const success = await sendVoiceMessage(
    ALLOWED_CHAT_ID,
    "Умар, на связи Antigravity. Голос настроен. Система на боевом дежурстве. Доступ закрыт для всех посторонних на сто процентов. Спокойно иди в школу, я жду твоих команд.",
    "🎙 Antigravity: На боевом дежурстве. Доступ закрыт для всех, кроме тебя."
  );
  console.log("Voice sent successfully:", success);
})();
