import fs from "fs";
import path from "path";
import { saveOrUpdateSession, SessionRecord, PageViewRecord, AnalyticsEventRecord, initDbTables, resolvePostgresUrl } from "../lib/analytics-store";

function parseDurationSeconds(str: string): number {
  if (!str) return 0;
  let total = 0;
  const hoursMatch = str.match(/(\d+)\s*h/i);
  if (hoursMatch) total += parseInt(hoursMatch[1], 10) * 3600;
  const minMatch = str.match(/(\d+)\s*m/i);
  if (minMatch) total += parseInt(minMatch[1], 10) * 60;
  const secMatch = str.match(/(\d+)\s*s/i);
  if (secMatch) total += parseInt(secMatch[1], 10);

  if (total === 0 && /^\d+$/.test(str.trim())) {
    total = parseInt(str.trim(), 10);
  }
  return total;
}

export function parseTelegramReports(rawText: string): SessionRecord[] {
  // Normalize html tags
  const clean = rawText
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");

  // Split into individual visitor report blocks
  const blocks = clean.split(/(?=🌍\s*Visitor Session Report|Visitor Session Report|🆔\s*Session:)/gi);
  const records: SessionRecord[] = [];

  for (const block of blocks) {
    if (!block.includes("Session:") && !block.includes("Active Time:")) {
      continue;
    }

    // 1. Session ID
    const sidMatch = block.match(/(?:🆔\s*)?Session:\s*([a-zA-Z0-9_-]+)/i);
    const sessionId = sidMatch ? sidMatch[1].trim() : `imported_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 2. Location
    const locMatch = block.match(/(?:📍\s*)?Location:\s*([^\n\r]+)/i);
    const locationStr = locMatch ? locMatch[1].trim() : "Unknown Location";
    
    let city = "Unknown";
    let countryName = "Unknown";
    let countryCode = "UNKNOWN";

    if (locationStr.includes(",")) {
      const parts = locationStr.replace(/📍/g, "").trim().split(",");
      city = parts[0].trim();
      countryName = parts[1]?.trim().replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "").trim() || "Unknown";
    } else if (locationStr !== "Unknown Location") {
      countryName = locationStr.replace(/📍/g, "").replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "").trim();
    }

    // 3. Device, Browser, OS
    const devMatch = block.match(/(?:📱\s*)?Device:\s*([^\n\r]+)/i);
    const browserMatch = block.match(/(?:🌐\s*)?Browser:\s*([^\n\r]+)/i);
    const osMatch = block.match(/(?:💻\s*)?OS:\s*([^\n\r]+)/i);

    const device = devMatch ? devMatch[1].trim() : "Desktop";
    const browser = browserMatch ? browserMatch[1].trim() : "Unknown";
    const os = osMatch ? osMatch[1].trim() : "Unknown";

    // 4. Lifetime & Active Time
    const lifetimeMatch = block.match(/(?:⏱\s*)?Session Lifetime:\s*([^\n\r]+)/i);
    const activeMatch = block.match(/(?:⚡\s*)?Active Time:\s*([^\n\r]+)/i);

    const sessionLifetime = lifetimeMatch ? parseDurationSeconds(lifetimeMatch[1]) : 0;
    const activeTime = activeMatch ? parseDurationSeconds(activeMatch[1]) : 0;
    const inactiveTime = Math.max(0, sessionLifetime - activeTime);

    // 5. Returning Visitor
    const retMatch = block.match(/(?:↩\s*)?Returning Visitor:\s*(Yes|No|true|false)/i);
    const isReturning = retMatch ? retMatch[1].toLowerCase().startsWith("y") || retMatch[1].toLowerCase() === "true" : false;

    // 6. Visited Pages
    const pages: PageViewRecord[] = [];
    const pagesSectionMatch = block.match(/Visited Pages[^\n]*:\s*([\s\S]*?)(?=\n\s*(?:⏱|⚡|↩|📋|🤖|👤|🔗|$))/i);
    if (pagesSectionMatch) {
      const lines = pagesSectionMatch[1].split("\n");
      for (const line of lines) {
        const trimmed = line.replace(/^[•\-\*\s]+/, "").trim();
        if (!trimmed || trimmed.startsWith("...")) continue;
        const pageMatch = trimmed.match(/^(\/[^\s\(\]]*)/);
        if (pageMatch) {
          const path = pageMatch[1];
          const is404 = trimmed.includes("[404]") || trimmed.includes("404");
          const durMatch = trimmed.match(/\((\d+)\s*s\s*active\)/i);
          const pageActive = durMatch ? parseInt(durMatch[1], 10) : 0;
          pages.push({
            path,
            activeDuration: pageActive,
            timeSpent: pageActive > 0 ? pageActive : 5,
            is404,
          });
        }
      }
    }

    // 7. Events (Code copies & AI activity)
    const events: AnalyticsEventRecord[] = [];
    
    // Code copies
    const copySectionMatch = block.match(/Code Copies[^\n]*:\s*([\s\S]*?)(?=\n\s*(?:🤖|👤|🔗|$))/i);
    if (copySectionMatch) {
      const lines = copySectionMatch[1].split("\n");
      for (const line of lines) {
        const copyLine = line.replace(/^[•\-\*\s]+/, "").trim();
        if (!copyLine || copyLine.includes("No components copied")) continue;
        const compMatch = copyLine.match(/([a-zA-Z0-9_-]+)\s*(?:[×x*:]\s*(\d+)|copies)/i);
        if (compMatch) {
          const component = compMatch[1];
          const count = compMatch[2] ? parseInt(compMatch[2], 10) : 1;
          for (let i = 0; i < count; i++) {
            events.push({
              eventType: "copy_code",
              component,
              timestamp: Date.now(),
            });
          }
        }
      }
    }

    // AI activity
    const aiSectionMatch = block.match(/AI Activity[^\n]*:\s*([\s\S]*?)(?=\n\s*(?:👤|🤖\s*Bot|🔗|$))/i);
    if (aiSectionMatch) {
      const lines = aiSectionMatch[1].split("\n");
      for (const line of lines) {
        const aiLine = line.toLowerCase();
        if (aiLine.includes("opened")) events.push({ eventType: "ai_opened", timestamp: Date.now() });
        else if (aiLine.includes("prompt")) events.push({ eventType: "ai_prompt_submitted", timestamp: Date.now() });
        else if (aiLine.includes("started")) events.push({ eventType: "ai_generation_started", timestamp: Date.now() });
        else if (aiLine.includes("completed")) events.push({ eventType: "ai_generation_completed", timestamp: Date.now() });
        else if (aiLine.includes("failed")) events.push({ eventType: "ai_generation_failed", timestamp: Date.now() });
      }
    }

    // 8. Human / Bot Likelihood & Traffic Source
    const humanLikelihoodMatch = block.match(/(?:👤\s*)?Human Likelihood:\s*(High|Medium|Low)/i);
    const botLikelihoodMatch = block.match(/(?:🤖\s*)?Bot Likelihood:\s*(High|Medium|Low)/i);
    const humanLikelihood = (humanLikelihoodMatch ? humanLikelihoodMatch[1] : "High") as "High" | "Medium" | "Low";
    const botLikelihood = (botLikelihoodMatch ? botLikelihoodMatch[1] : "Low") as "High" | "Medium" | "Low";

    const trafficType: "Human" | "Bot" | "Unknown" = botLikelihood === "High" ? "Bot" : "Human";

    const srcMatch = block.match(/(?:🔗\s*)?Traffic Source:\s*([^\n\r\(]+)/i);
    const trafficSource = srcMatch ? srcMatch[1].trim() : "Direct";

    const utmCampaignMatch = block.match(/Campaign:\s*([^)]+)/i);
    const utm_campaign = utmCampaignMatch ? utmCampaignMatch[1].trim() : undefined;

    const record: SessionRecord = {
      visitorId: `visitor_${sessionId}`,
      sessionId,
      createdAt: Date.now() - sessionLifetime * 1000,
      lastActivityAt: Date.now(),
      sessionLifetime,
      activeTime,
      inactiveTime,
      countryCode,
      countryName,
      city,
      locationStr,
      device,
      browser,
      os,
      trafficSource,
      referrer: trafficSource,
      utm: { utm_campaign, utm_source: trafficSource.toLowerCase().includes("youtube") ? "youtube" : undefined },
      humanScore: humanLikelihood === "High" ? 80 : 30,
      botLikelihood,
      humanLikelihood,
      trafficType,
      isReturning,
      pages: pages.length > 0 ? pages : [{ path: "/", activeDuration: activeTime, timeSpent: sessionLifetime }],
      events,
      telegramSent: true,
    };

    records.push(record);
  }

  return records;
}

async function runImport() {
  const filePath = path.resolve(process.cwd(), "telegram_history.txt");
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    console.log(`👉 Please paste your Telegram chat messages into 'telegram_history.txt' and re-run.`);
    return;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const sessions = parseTelegramReports(raw);

  console.log(`\n==================================================`);
  console.log(`PARSED ${sessions.length} SESSIONS FROM TELEGRAM HISTORY`);
  console.log(`==================================================\n`);

  if (sessions.length === 0) {
    console.log("No Visitor Session Report messages found in file.");
    return;
  }

  let totalActive = 0;
  let totalLifetime = 0;
  let totalCopies = 0;

  for (const s of sessions) {
    totalActive += s.activeTime;
    totalLifetime += s.sessionLifetime;
    totalCopies += s.events.filter(e => e.eventType === "copy_code").length;
    await saveOrUpdateSession(s);
    console.log(`✅ Saved: Session ${s.sessionId} | ${s.locationStr} | Active: ${s.activeTime}s | Pages: ${s.pages.length}`);
  }

  console.log(`\n==================================================`);
  console.log(`SUCCESSFULLY IMPORTED ${sessions.length} SESSIONS INTO POSTGRES`);
  console.log(`Total Active Time: ${Math.floor(totalActive / 60)}m ${totalActive % 60}s`);
  console.log(`Total Lifetime: ${Math.floor(totalLifetime / 60)}m ${totalLifetime % 60}s`);
  console.log(`Total Code Copies: ${totalCopies}`);
  console.log(`==================================================\n`);
}

if (process.argv[1]?.includes("import-telegram-history")) {
  runImport().catch(console.error);
}
