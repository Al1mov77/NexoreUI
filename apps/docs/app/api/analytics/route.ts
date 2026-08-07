import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Rate limiting map: only stores IP in RAM for rate limiting. Never persisted or sent to Telegram.
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (record) {
    if (now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      return false;
    }
    if (record.count >= 20) return true;
    record.count++;
    return false;
  }
  rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
  return false;
}

function parseUserAgent(ua: string): { browser: string, os: string, device: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown", device: "Unknown" };
  
  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("Android") || ua.includes("iPhone")) {
    device = "Mobile";
  }
  if (ua.includes("iPad") || (ua.includes("Android") && !ua.includes("Mobile"))) {
    device = "Tablet";
  }

  return { browser, os, device };
}

function anonymizeIp(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 4) {
      return parts.slice(0, 4).join(":") + ":xxxx:xxxx:xxxx:xxxx";
    }
  } else {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }
  return "anonymized";
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "";
  }
}

async function sendTelegramMessage(html: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === "YOUR_CHAT_ID_HERE") {
    return;
  }
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: html,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  }).catch(e => console.error("Telegram error:", e));
}

export async function POST(req: Request) {
  try {
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ip = rawIp.split(",")[0].trim();
    
    if (ip !== "unknown" && isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { sessionId, sessionData } = body;
    
    if (!sessionId || !sessionData) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const uaString = req.headers.get("user-agent") || "";
    const countryCode = req.headers.get("x-vercel-ip-country") || "Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";
    const referrer = req.headers.get("referer") || "Direct";
    
    const { browser, os, device } = parseUserAgent(uaString);
    const anonymizedIp = anonymizeIp(ip);
    
    const dailySalt = new Date().toISOString().split('T')[0];
    const sessionHash = crypto.createHash("sha256").update(ip + uaString + dailySalt).digest("hex").substring(0, 16);

    const flag = getFlagEmoji(countryCode);
    const countryStr = countryCode !== "Unknown" ? `${countryCode} ${flag}`.trim() : "Unknown";

    // 1. Calculate Bot Probability
    let botProbability = 0;
    const lowerUA = uaString.toLowerCase();
    
    if (lowerUA.includes("bot") || lowerUA.includes("spider") || lowerUA.includes("curl") || lowerUA.includes("headless")) {
      botProbability += 80;
    }
    if (sessionData.humanScore === 0) botProbability += 40;
    if (sessionData.duration < 2 && sessionData.pages.length > 2) botProbability += 50;

    botProbability = Math.min(100, botProbability);
    const humanProbability = 100 - botProbability;

    // 2. Persist to Database (Only if explicitly deployed/configured by user later)
    if (process.env.POSTGRES_URL) {
      try {
        await sql`
          INSERT INTO analytics_sessions 
          (id, session_hash, location_country, location_city, browser, os, device, duration_seconds, page_count, is_returning, bot_probability, anonymized_ip)
          VALUES 
          (${uuidv4()}, ${sessionHash}, ${countryCode}, ${city}, ${browser}, ${os}, ${device}, ${sessionData.duration}, ${sessionData.pages.length}, ${sessionData.isReturning}, ${botProbability}, ${anonymizedIp})
        `;
        
        for (const page of sessionData.pages) {
          await sql`
            INSERT INTO analytics_page_views (session_id, path, time_spent_seconds)
            VALUES ((SELECT id FROM analytics_sessions WHERE session_hash = ${sessionHash} ORDER BY created_at DESC LIMIT 1), ${page.path}, ${page.timeSpent})
          `;
        }
      } catch (dbError) {
        console.error("DB Insertion Error:", dbError);
      }
    }

    // 3. Telegram Summary Alert (Aggregated Session)
    if (botProbability < 90 && sessionData.pages.length > 0) {
      const minutes = Math.floor(sessionData.duration / 60);
      const seconds = sessionData.duration % 60;
      const durationStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      
      const pathsText = sessionData.pages.slice(0, 10).map((p: any) => p.path).join("\n");
      
      let refHost = referrer;
      try {
        if (referrer !== "Direct") {
          refHost = new URL(referrer).hostname;
        }
      } catch (e) {}

      const msg = `🌍 <b>New Visitor</b>\n\n` +
        `Country: ${countryStr}\n` +
        `City: ${city}\n\n` +
        `Device: ${device}\n` +
        `Browser: ${browser}\n` +
        `OS: ${os}\n\n` +
        `Pages:\n<code>${pathsText}</code>\n\n` +
        `Session: ${durationStr}\n` +
        `Pages viewed: ${sessionData.pages.length}\n` +
        `Human Score: ${humanProbability}%\n` +
        `Bot Probability: ${botProbability}%\n\n` +
        `Referrer: ${refHost}`;
        
      await sendTelegramMessage(msg);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
