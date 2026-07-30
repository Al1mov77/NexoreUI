import { NextResponse } from "next/server"

const countryNames: Record<string, string> = {
  RU: "Russia",
  UZ: "Uzbekistan",
  KZ: "Kazakhstan",
  US: "USA",
  UA: "Ukraine",
  BY: "Belarus",
  DE: "Germany",
  GB: "United Kingdom",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  TR: "Turkey",
  CN: "China",
  IN: "India",
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🏳️"
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  try {
    return String.fromCodePoint(...codePoints)
  } catch (e) {
    return "🏳️"
  }
}

function getCountryName(countryCode: string): string {
  const code = countryCode.toUpperCase()
  if (countryNames[code]) return countryNames[code]
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
    return regionNames.of(code) || code
  } catch (e) {
    return code
  }
}

function parseUserAgent(ua: string): string {
  if (!ua) return "Unknown"
  let os = "Unknown OS"
  if (ua.includes("Windows")) os = "Windows"
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("Android")) os = "Android"
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"

  let browser = "Unknown Browser"
  if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg")) browser = "Chrome"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Edg")) browser = "Edge"
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera"

  return `${browser} (${os})`
}

// Simple in-memory rate limiter (effective for bursts in serverless environments)
const rateLimitCache = new Map<string, { count: number, resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(ip);
  
  if (record) {
    if (now > record.resetTime) {
      rateLimitCache.set(ip, { count: 1, resetTime: now + 60000 }); // 1 min window
      return false;
    }
    if (record.count >= 15) {
      return true; // Max 15 requests per minute per IP
    }
    record.count++;
    return false;
  }
  
  rateLimitCache.set(ip, { count: 1, resetTime: now + 60000 });
  return false;
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin") || ""
    const referer = req.headers.get("referer") || ""
    const secret = req.headers.get("x-nexore-secret")
    const uaString = req.headers.get("user-agent") || ""

    // 1. Secret Key Check
    if (secret !== "nx-notify-secure-7788") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 })
    }

    // 2. Anti-Bot User Agent Detection
    const lowerUA = uaString.toLowerCase();
    if (!uaString || lowerUA.includes("curl") || lowerUA.includes("postman") || lowerUA.includes("python") || lowerUA.includes("bot") || lowerUA.includes("spider") || lowerUA.includes("insomnia")) {
      return NextResponse.json({ success: false, error: "Bot traffic blocked" }, { status: 403 })
    }

    // 3. Strict Origin/Referer Validation (Production only)
    if (process.env.NODE_ENV === "production") {
      const isValidOrigin = origin.includes("nexoreui.vercel.app") || referer.includes("nexoreui.vercel.app")
      if (!isValidOrigin) {
        return NextResponse.json({ success: false, error: "Invalid Origin" }, { status: 403 })
      }
    }

    // Resolve client IP
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const ip = rawIp.split(",")[0].trim()

    // 4. Rate Limiting Check
    if (ip !== "unknown" && isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 })
    }

    const body = await req.json()
    const { type, path, referrer, componentName, fileName } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    // Check if configured. If not, log and return success to avoid client-side errors
    if (!botToken || !chatId || chatId === "YOUR_CHAT_ID_HERE") {
      console.warn("Telegram bot token or chat ID is not configured.")
      return NextResponse.json({ success: false, error: "Not configured" }, { status: 200 })
    }

    // Resolve client country
    const countryCode = req.headers.get("x-vercel-ip-country") || ""
    const city = req.headers.get("x-vercel-ip-city") || ""
    const userAgent = parseUserAgent(uaString)

    let locationStr = "Unknown Location"
    if (countryCode) {
      const flag = getFlagEmoji(countryCode)
      const countryName = getCountryName(countryCode)
      locationStr = `${flag} ${city ? city + ", " : ""}${countryName} (${countryCode})`
    }

    let messageHtml = ""

    if (type === "visit") {
      const formattedReferrer = referrer && referrer !== "Direct" && referrer !== "" 
        ? `<code>${referrer}</code>`
        : "<i>Direct / Bookmark</i>"

      messageHtml = 
        `🌐 <b>New Visit on NexoreUI</b>\n\n` +
        `📍 <b>Page:</b> <code>${path}</code>\n` +
        `🌍 <b>Location:</b> ${locationStr}\n` +
        `🔌 <b>IP:</b> <code>${ip}</code>\n` +
        `🧭 <b>Browser/OS:</b> <code>${userAgent}</code>\n` +
        `🔗 <b>Referrer:</b> ${formattedReferrer}`
    } else if (type === "copy") {
      messageHtml = 
        `📋 <b>Component Copied</b>\n\n` +
        `📦 <b>Component:</b> <code>${componentName || "Unknown"}</code>\n` +
        `📄 <b>File:</b> <code>${fileName || "component.tsx"}</code>\n` +
        `📍 <b>Page:</b> <code>${path}</code>\n` +
        `🌍 <b>Location:</b> ${locationStr}\n` +
        `🧭 <b>Browser/OS:</b> <code>${userAgent}</code>`
    } else {
      return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 })
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageHtml,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Telegram API sending error:", errorText)
      return NextResponse.json({ success: false, error: "Telegram API error" }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in telegram-notify API:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
