import fs from "fs";
import path from "path";
import { saveOrUpdateSession, parseTelegramReports, getDashboardStats } from "../lib/analytics-store";

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

  const stats = await getDashboardStats("all");

  console.log(`\n==================================================`);
  console.log(`SUCCESSFULLY IMPORTED ${sessions.length} SESSIONS INTO POSTGRES`);
  console.log(`All-Time Unique Visitors: ${stats.totalTraffic.allTimeUniqueVisitors}`);
  console.log(`All-Time Active Time: ${stats.totalTime.allTimeHumanActiveTime}`);
  console.log(`All-Time Total Lifetime: ${stats.totalTime.allTimeTotalLifetime}`);
  console.log(`Total Code Copies: ${totalCopies}`);
  console.log(`==================================================\n`);
}

if (process.argv[1]?.includes("import-telegram-history")) {
  runImport().catch(console.error);
}
