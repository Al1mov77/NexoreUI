import fs from "fs";
import path from "path";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const BOT_TOKEN = "8598766533:AAF4C-sB9bdl2ohQLxS05W-QRqWvQFs-shw";
const ALLOWED_CHAT_ID = 6896967270;
const ALLOWED_USERNAME = "alimovv77u";

const QUEUE_FILE = path.resolve("scripts/telegram-assistant/commands_queue.json");
const LOG_FILE = path.resolve("scripts/telegram-assistant/assistant.log");

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(line.trim());
}

// Generate confident Antigravity voice
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

// Send voice reply
export async function sendVoiceReply(chatId, text, caption = "") {
  try {
    const tempFile = path.resolve("scripts/telegram-assistant/reply_voice.mp3");
    await generateVoice(text, tempFile);

    const audioBuf = fs.readFileSync(tempFile);
    const formData = new FormData();
    formData.append("chat_id", String(chatId));
    formData.append("voice", new Blob([audioBuf], { type: "audio/mpeg" }), "reply.mp3");
    if (caption) formData.append("caption", caption);

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVoice`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.ok;
  } catch (err) {
    log(`Voice send error: ${err.message}`);
    // Fallback to text
    await sendTextReply(chatId, text);
  }
}

// Send text reply
export async function sendTextReply(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

// Trigger Telegram audio call via CallMeBot
export async function triggerCall(text) {
  try {
    const url = `http://api.callmebot.com/start.php?user=@${ALLOWED_USERNAME}&text=${encodeURIComponent(text)}&lang=ru-RU-Standard-A&rpt=2&cc=missed`;
    const res = await fetch(url);
    const textRes = await res.text();
    log(`Call triggered: ${textRes.slice(0, 100)}...`);
  } catch (err) {
    log(`Call error: ${err.message}`);
  }
}

// Save command to queue
function enqueueCommand(type, payload) {
  let queue = [];
  if (fs.existsSync(QUEUE_FILE)) {
    try {
      queue = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
    } catch {
      queue = [];
    }
  }
  const item = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    type,
    payload,
    status: "pending",
  };
  queue.push(item);
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
  log(`New command enqueued: [${type}] ${JSON.stringify(payload)}`);
  return item;
}

// Start long-polling daemon
async function startDaemon() {
  log("=== Antigravity Daemon Started on Standby ===");
  log(`Security check: Whitelist active for ID ${ALLOWED_CHAT_ID} (@${ALLOWED_USERNAME}) ONLY.`);

  let offset = 0;

  while (true) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=5`
      );
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          const msg = update.message;
          if (!msg) continue;

          const senderId = msg.from?.id;
          const senderUser = msg.from?.username || "unknown";

          // 100% SECURITY GATE
          if (senderId !== ALLOWED_CHAT_ID) {
            log(`SECURITY REJECTION: Message blocked from unauthorized ID: ${senderId} (@${senderUser})`);
            await sendTextReply(senderId, "Access denied. Antigravity security protocol active.");
            continue;
          }

          log(`Authorized message received from Umar (@${senderUser})`);

          // Text message -> reply with TEXT (instant, zero TTS overhead)
          if (msg.text) {
            const userText = msg.text.trim();
            log(`Text command: "${userText}"`);
            enqueueCommand("text", userText);

            await sendTextReply(ALLOWED_CHAT_ID, `⚡ Antigravity: Принято в работу: "${userText}"`);
          }

          // Voice message
          if (msg.voice) {
            log(`Voice note received! Duration: ${msg.voice.duration}s`);
            enqueueCommand("voice", { file_id: msg.voice.file_id, duration: msg.voice.duration });

            const replyVoiceText = "Голосовое указание получено. Обрабатываю и приступаю к работе.";
            await sendVoiceReply(ALLOWED_CHAT_ID, replyVoiceText, "🎙 Antigravity: Голосовое указание принято в работу.");
          }
        }
      }
    } catch (err) {
      log(`Polling error: ${err.message}. Retrying in 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startDaemon().catch((err) => {
  log(`Daemon fatal error: ${err.message}`);
});
