import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const BOT_TOKEN = "8598766533:AAF4C-sB9bdl2ohQLxS05W-QRqWvQFs-shw";
const ALLOWED_CHAT_ID = 6896967270;

function sendViaCurl(text) {
  try {
    const safeText = text.replace(/"/g, '\\"').replace(/\n/g, " ");
    const cmd = `curl.exe -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" -d "chat_id=${ALLOWED_CHAT_ID}" -d "text=${safeText}"`;
    const out = execSync(cmd).toString();
    const data = JSON.parse(out);
    return data.ok;
  } catch (err) {
    console.error("Curl send failed:", err.message);
    return false;
  }
}

function sendVoiceViaCurl(filePath, caption = "") {
  try {
    const safeCaption = caption.replace(/"/g, '\\"');
    const cmd = `curl.exe -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendVoice" -F "chat_id=${ALLOWED_CHAT_ID}" -F "voice=@${filePath}" -F "caption=${safeCaption}"`;
    const out = execSync(cmd).toString();
    const data = JSON.parse(out);
    return data.ok;
  } catch (err) {
    console.error("Curl voice send failed:", err.message);
    return false;
  }
}

export async function notify(text, sendVoice = false) {
  sendViaCurl(`⚡ Antigravity Report:\n${text}`);

  if (sendVoice) {
    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata("ru-RU-DmitryNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
      const tempFile = path.resolve("scripts/telegram-assistant/report_voice.mp3");
      const { audioStream } = tts.toStream(text);
      const out = fs.createWriteStream(tempFile);
      audioStream.pipe(out);
      await new Promise((resolve, reject) => {
        out.on("finish", resolve);
        audioStream.on("error", reject);
        out.on("error", reject);
      });

      sendVoiceViaCurl(tempFile, "🎙 Antigravity: Голосовой отчёт");
    } catch (err) {
      console.error("Voice synthesis failed:", err.message);
    }
  }

  return true;
}

const args = process.argv.slice(2);
if (args.length > 0) {
  const isVoice = args.includes("--voice");
  const msg = args.filter((a) => a !== "--voice").join(" ");
  notify(msg, isVoice).then(() => {
    console.log("Report delivered.");
    process.exit(0);
  });
}
