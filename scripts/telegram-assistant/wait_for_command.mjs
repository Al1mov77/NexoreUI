import fs from "fs";
import path from "path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const BOT_TOKEN = "8598766533:AAF4C-sB9bdl2ohQLxS05W-QRqWvQFs-shw";
const ALLOWED_CHAT_ID = 6896967270;
const ALLOWED_USERNAME = "alimovv77u";

const OFFSET_FILE = path.resolve("scripts/telegram-assistant/offset.txt");

function getOffset() {
  if (fs.existsSync(OFFSET_FILE)) {
    try {
      return parseInt(fs.readFileSync(OFFSET_FILE, "utf-8").trim(), 10) || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

function saveOffset(offset) {
  fs.writeFileSync(OFFSET_FILE, String(offset));
}

// Confident voice reply
async function sendVoiceReply(chatId, text, caption = "") {
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata("ru-RU-DmitryNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const tempFile = path.resolve("scripts/telegram-assistant/reply_voice.mp3");
    const { audioStream } = tts.toStream(text);
    const out = fs.createWriteStream(tempFile);
    audioStream.pipe(out);
    await new Promise((resolve, reject) => {
      out.on("finish", resolve);
      audioStream.on("error", reject);
      out.on("error", reject);
    });

    const audioBuf = fs.readFileSync(tempFile);
    const formData = new FormData();
    formData.append("chat_id", String(chatId));
    formData.append("voice", new Blob([audioBuf], { type: "audio/mpeg" }), "reply.mp3");
    if (caption) formData.append("caption", caption);

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.error("Voice reply error:", err.message);
  }
}

// Text reply
async function sendTextReply(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function waitForCommand() {
  let offset = getOffset();

  while (true) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=5`
      );
      const data = await res.json();

      if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          saveOffset(offset);

          const msg = update.message;
          if (!msg) continue;

          const senderId = msg.from?.id;
          const senderUser = msg.from?.username || "unknown";

          // 100% SECURITY GATE
          if (senderId !== ALLOWED_CHAT_ID) {
            console.error(`SECURITY ALERT: Blocked outsider ID ${senderId} (@${senderUser})`);
            await sendTextReply(senderId, "Access denied. Antigravity security protocol active.");
            continue;
          }

          // Authorized command received!
          let commandData = null;

          if (msg.text) {
            const text = msg.text.trim();
            // Fast text acknowledgement
            await sendTextReply(ALLOWED_CHAT_ID, `⚡ Antigravity: Принято в работу: "${text}"`);
            commandData = { type: "text", text, sender: `@${senderUser}`, date: new Date().toISOString() };
          } else if (msg.voice) {
            // Voice acknowledgement
            await sendVoiceReply(ALLOWED_CHAT_ID, "Голосовое указание принято. Обрабатываю и приступаю к работе.", "🎙 Antigravity: Принято в работу.");
            commandData = { type: "voice", file_id: msg.voice.file_id, duration: msg.voice.duration, sender: `@${senderUser}`, date: new Date().toISOString() };
          }

          if (commandData) {
            // Output JSON result and EXIT process immediately!
            // This triggers Antigravity reactive wake-up in the chat!
            console.log(JSON.stringify(commandData));
            process.exit(0);
          }
        }
      }
    } catch (err) {
      // Retry on network glitch
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

waitForCommand().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
