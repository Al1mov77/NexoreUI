import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveOrUpdateSession, SessionRecord } from "../../../lib/analytics-store";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Simple in-memory IP rate limiter to block flood attacks
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const processedRequests = new Set<string>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (record) {
    if (now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      return false;
    }
    if (record.count >= 30) return true;
    record.count++;
    return false;
  }
  rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
  return false;
}

function parseUserAgent(ua: string): { browser: string; os: string; device: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown", device: "Unknown" };

  let os = "Unknown";
  if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Macintosh") || ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Chrome") && !ua.includes("Chromium") && !ua.includes("Edg") && !ua.includes("OPR")) browser = "Chrome";
  else if (ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("iPhone") || (ua.includes("Android") && ua.includes("Mobile"))) {
    device = "Mobile";
  } else if (ua.includes("iPad") || (ua.includes("Android") && !ua.includes("Mobile")) || (ua.includes("Macintosh") && ua.includes("Touch"))) {
    device = "Tablet";
  }

  return { browser, os, device };
}

function anonymizeIp(ip: string): string {
  if (!ip || ip === "unknown") return "unknown";
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.length > 4 ? parts.slice(0, 4).join(":") + ":xxxx:xxxx:xxxx:xxxx" : "anonymized-v6";
  } else {
    const parts = ip.split(".");
    return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.xxx` : "anonymized-v4";
  }
}

function getCountryName(countryCode: string): string {
  if (!countryCode || countryCode === "Unknown" || countryCode.length !== 2) return "Unknown";
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode.toUpperCase()) || countryCode;
  } catch (e) {
    return countryCode;
  }
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2 || countryCode === "Unknown") return "";
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

function decodeCityName(cityRaw: string): string {
  if (!cityRaw || cityRaw === "Unknown") return "Unknown";
  try {
    return decodeURIComponent(cityRaw);
  } catch (e) {
    return cityRaw;
  }
}

function determineTrafficSource(referrer: string, utmSource?: string): string {
  if (utmSource) {
    const src = utmSource.toLowerCase();
    if (src.includes("youtube")) return "YouTube";
    if (src.includes("google")) return "Google";
    if (src.includes("github")) return "GitHub";
    if (src.includes("reddit")) return "Reddit";
    return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
  }

  if (!referrer || referrer === "Direct" || referrer === "unknown") return "Direct";

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
    if (host.includes("google.com") || host.includes("google.")) return "Google";
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("reddit.com")) return "Reddit";
    if (host.includes("t.co") || host.includes("twitter.com") || host.includes("x.com")) return "X / Twitter";
    return host;
  } catch (e) {
    return "Other";
  }
}

import { buildDashboardKeyboard } from "../../../lib/telegram-keyboard";

async function sendOrUpdateTelegramMessage(textHtml: string, messageId?: number | null): Promise<number | null> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === "YOUR_CHAT_ID_HERE") {
    return null;
  }

  try {
    if (messageId) {
      // Edit existing Telegram message instead of sending a duplicate
      const editRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          message_id: messageId,
          text: textHtml,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: buildDashboardKeyboard("today"),
        }),
      });
      const editData = await editRes.json();
      if (editData.ok) {
        return messageId;
      }
    }

    // Send new Telegram message
    const sendRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: textHtml,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: buildDashboardKeyboard("today"),
      }),
    });
    const sendData = await sendRes.json();
    if (sendData.ok && sendData.result && sendData.result.message_id) {
      return sendData.result.message_id;
    }
  } catch (e) {
    console.error("Telegram API error:", e);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const rawIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ip = rawIp.split(",")[0].trim();

    if (ip !== "unknown" && isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { requestId, visitorId, sessionId, sessionData } = body;

    if (!sessionId || !sessionData) {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    // Idempotency: Ignore rapid duplicate request IDs
    if (requestId && processedRequests.has(requestId)) {
      return NextResponse.json({ success: true, cached: true });
    }
    if (requestId) {
      processedRequests.add(requestId);
      if (processedRequests.size > 1000) processedRequests.clear();
    }

    const uaString = req.headers.get("user-agent") || "";
    const rawCountry = req.headers.get("x-vercel-ip-country") || "Unknown";
    const rawCity = req.headers.get("x-vercel-ip-city") || "Unknown";
    const rawReferrer = req.headers.get("referer") || "Direct";

    const { browser, os, device } = parseUserAgent(uaString);
    const anonymizedIp = anonymizeIp(ip);

    const countryCode = rawCountry.toUpperCase();
    const countryName = getCountryName(countryCode);
    const decodedCity = decodeCityName(rawCity);
    const flag = getFlagEmoji(countryCode);

    let locationStr = "Unknown Location";
    if (countryCode !== "UNKNOWN") {
      if (decodedCity !== "Unknown") {
        locationStr = `📍 ${decodedCity}, ${countryName} ${flag}`;
      } else {
        locationStr = `📍 ${countryName} ${flag}`;
      }
    }

    // 1. Multi-Signal Bot Detection
    let botLikelihood: "High" | "Medium" | "Low" = "Low";
    let humanLikelihood: "High" | "Medium" | "Low" = "Low";
    const botReasons: string[] = [];
    const humanReasons: string[] = [];

    const lowerUA = uaString.toLowerCase();
    if (!uaString || uaString === "Unknown") {
      botLikelihood = "High";
      botReasons.push("Empty or missing User-Agent header");
    } else if (
      lowerUA.includes("bot") ||
      lowerUA.includes("spider") ||
      lowerUA.includes("crawl") ||
      lowerUA.includes("headless") ||
      lowerUA.includes("curl") ||
      lowerUA.includes("wget") ||
      lowerUA.includes("python") ||
      lowerUA.includes("puppeteer") ||
      lowerUA.includes("selenium")
    ) {
      botLikelihood = "High";
      botReasons.push("Known Crawler/Headless User-Agent detected");
    }

    if (sessionData.botIndicators?.webdriver) {
      botLikelihood = "High";
      botReasons.push("Headless browser environment (navigator.webdriver = true)");
    }

    // 404 Scanning detection
    const pagesList: any[] = Array.isArray(sessionData.pages) ? sessionData.pages : [];
    const count404 = pagesList.filter((p) => p.is404 || (p.path && p.path.includes("404"))).length;
    if (count404 > 2) {
      botLikelihood = "High";
      botReasons.push(`Suspicious 404 scanning detected (${count404} invalid pages requested)`);
    }

    // Fast traversal detection
    if (sessionData.sessionLifetime < 3 && pagesList.length > 3) {
      botLikelihood = "High";
      botReasons.push("Abnormally fast navigation (>3 pages in <3s)");
    }

    if (sessionData.humanScore > 0) {
      humanLikelihood = sessionData.humanScore > 20 ? "High" : "Medium";
      humanReasons.push(`Active DOM interaction recorded (score: ${sessionData.humanScore})`);
    } else {
      if (botLikelihood !== "High") botLikelihood = "Medium";
      botReasons.push("Zero DOM interaction events recorded");
    }

    if (sessionData.activeTime > 5) {
      humanReasons.push(`Realistic active duration (${sessionData.activeTime}s)`);
      if (humanLikelihood === "Low") humanLikelihood = "Medium";
    }

    if (sessionData.isReturning) {
      humanReasons.push("Returning visitor (persistent local identifier)");
    }

    // Classification
    let trafficType: "Human" | "Bot" | "Unknown" = "Human";
    if (botLikelihood === "High") {
      trafficType = "Bot";
      humanLikelihood = "Low";
    } else if (humanLikelihood === "High") {
      trafficType = "Human";
    } else {
      trafficType = "Unknown";
    }

    // Traffic Source
    const trafficSource = determineTrafficSource(rawReferrer, sessionData.utm?.utm_source);

    // 2. Build Session Record
    const sessionRecord: SessionRecord = {
      visitorId: visitorId || sessionData.visitorId || "anonymous",
      sessionId,
      createdAt: sessionData.createdAt || Date.now(),
      lastActivityAt: sessionData.lastActivityAt || Date.now(),
      sessionLifetime: sessionData.sessionLifetime || 0,
      activeTime: sessionData.activeTime || 0,
      inactiveTime: sessionData.inactiveTime || 0,
      countryCode,
      countryName,
      city: decodedCity,
      locationStr,
      device,
      browser,
      os,
      trafficSource,
      referrer: rawReferrer,
      utm: sessionData.utm || {},
      humanScore: sessionData.humanScore || 0,
      botLikelihood,
      humanLikelihood,
      trafficType,
      isReturning: !!sessionData.isReturning,
      pages: pagesList,
      events: Array.isArray(sessionData.events) ? sessionData.events : [],
      telegramSent: false,
      anonymizedIp,
    };

    // Calculate Summary Hash for Telegram Idempotency
    const activeTimeStr = Math.floor(sessionRecord.activeTime / 10) * 10; // bucket by 10s increments
    const summaryDataStr = `${sessionId}_${pagesList.length}_${activeTimeStr}_${sessionRecord.events.length}_${trafficType}`;
    const newSummaryHash = crypto.createHash("sha256").update(summaryDataStr).digest("hex").substring(0, 16);
    sessionRecord.summaryHash = newSummaryHash;

    // Save/Update in DB and retrieve existing Telegram message ID if any
    const { existingMessageId } = await saveOrUpdateSession(sessionRecord);
    if (existingMessageId) {
      sessionRecord.telegramMessageId = existingMessageId;
    }

    // 3. Telegram Summary Alert (Send or Update)
    // Only send summary for Human or Suspicious Bot sessions with visited pages
    if (pagesList.length > 0) {
      const minutesLifetime = Math.floor(sessionRecord.sessionLifetime / 60);
      const secondsLifetime = sessionRecord.sessionLifetime % 60;
      const lifetimeStr = minutesLifetime > 0 ? `${minutesLifetime}m ${secondsLifetime}s` : `${secondsLifetime}s`;

      const minutesActive = Math.floor(sessionRecord.activeTime / 60);
      const secondsActive = sessionRecord.activeTime % 60;
      const activeStr = minutesActive > 0 ? `${minutesActive}m ${secondsActive}s` : `${secondsActive}s`;

      // Aggregate Events
      const copyCounts: Record<string, number> = {};
      const aiEvents: string[] = [];

      sessionRecord.events.forEach((ev) => {
        // STRICT PRIVACY: NEVER include prompt text or clipboard code
        if (ev.eventType === "copy_code" && ev.component) {
          copyCounts[ev.component] = (copyCounts[ev.component] || 0) + 1;
        } else if (ev.eventType && ev.eventType.startsWith("ai_")) {
          if (ev.eventType === "ai_opened") aiEvents.push("Nexore Make opened");
          else if (ev.eventType === "ai_prompt_submitted") aiEvents.push("Prompt submitted");
          else if (ev.eventType === "ai_generation_completed") aiEvents.push("Generation completed");
          else if (ev.eventType === "ai_generation_failed") aiEvents.push("Generation failed");
        }
      });

      if (Object.keys(copyCounts).length > 0) {
        humanReasons.push(`Copied code for ${Object.keys(copyCounts).length} component(s)`);
        if (humanLikelihood !== "High" && botLikelihood !== "High") humanLikelihood = "High";
      }

      if (aiEvents.length > 0) {
        humanReasons.push(`Used Nexore Make AI generator (${aiEvents.length} action(s))`);
        if (humanLikelihood !== "High" && botLikelihood !== "High") humanLikelihood = "High";
      }

      const copyStr = Object.entries(copyCounts)
        .map(([comp, count]) => `  • ${comp} × ${count}`)
        .join("\n");

      const aiCounts: Record<string, number> = {};
      aiEvents.forEach((e) => (aiCounts[e] = (aiCounts[e] || 0) + 1));
      const aiStr = Object.entries(aiCounts)
        .map(([ev, count]) => `  • ${ev}${count > 1 ? ` × ${count}` : ""}`)
        .join("\n");

      const maxPagesToShow = 10;
      const pageItems = pagesList.slice(0, maxPagesToShow).map((p: any) => {
        const time = p.activeDuration && p.activeDuration > 0 ? ` <i>(${p.activeDuration}s active)</i>` : "";
        const tag = p.is404 ? " [404]" : "";
        return `  • <code>${p.path}</code>${tag}${time}`;
      });
      if (pagesList.length > maxPagesToShow) {
        pageItems.push(`  • <i>... +${pagesList.length - maxPagesToShow} more page(s)</i>`);
      }
      const pagesStr = pageItems.join("\n");

      let msg =
        `🌍 <b>Visitor Session Report</b>\n\n` +
        `🆔 Session: <code>${sessionId.substring(0, 12)}</code>\n\n` +
        `📍 Location: ${locationStr}\n` +
        `📱 Device: ${device}\n` +
        `🌐 Browser: ${browser}\n` +
        `💻 OS: ${os}\n\n` +
        `📄 <b>Visited Pages (${pagesList.length}):</b>\n${pagesStr}\n\n` +
        `⏱ <b>Session Lifetime:</b> ${lifetimeStr}\n` +
        `⚡ <b>Active Time:</b> ${activeStr}\n` +
        `↩ <b>Returning Visitor:</b> ${sessionRecord.isReturning ? "Yes" : "No"}\n\n`;

      if (copyStr) {
        msg += `📋 <b>Code Copies:</b>\n${copyStr}\n\n`;
      }

      if (aiStr) {
        msg += `🤖 <b>AI Activity:</b>\n${aiStr}\n\n`;
      }

      msg += `👤 <b>Human Likelihood:</b> ${humanLikelihood}\n`;
      if (humanReasons.length > 0) {
        msg += humanReasons.map((r) => `  💡 ${r}`).join("\n") + `\n`;
      }
      msg += `\n`;

      msg += `🤖 <b>Bot Likelihood:</b> ${botLikelihood}\n`;
      if (botReasons.length > 0) {
        msg += botReasons.map((r) => `  ⚠️ ${r}`).join("\n") + `\n`;
      }
      msg += `\n`;

      msg += `🔗 <b>Traffic Source:</b> ${trafficSource}`;
      if (sessionRecord.utm.utm_campaign) {
        msg += ` <i>(Campaign: ${sessionRecord.utm.utm_campaign})</i>`;
      }

      // Dispatch or update Telegram summary message
      const msgId = await sendOrUpdateTelegramMessage(msg, sessionRecord.telegramMessageId);
      if (msgId && msgId !== sessionRecord.telegramMessageId) {
        sessionRecord.telegramMessageId = msgId;
        sessionRecord.telegramSent = true;
        await saveOrUpdateSession(sessionRecord);
      }
    }

    return NextResponse.json({ success: true, sessionId, trafficType });
  } catch (error: any) {
    console.error("Analytics Endpoint Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
