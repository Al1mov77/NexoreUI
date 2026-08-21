import fs from "fs";
import path from "path";
import { saveOrUpdateSession, parseTelegramReports, getDashboardStats, initDbTables } from "../lib/analytics-store";

async function runJsonImport() {
  const possiblePaths = [
    path.resolve(process.cwd(), "packages/cli/src/result.json"),
    path.resolve(process.cwd(), "result.json"),
    path.resolve(process.cwd(), "telegram_history.txt"),
  ];

  let targetPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      targetPath = p;
      break;
    }
  }

  if (!targetPath) {
    console.error("❌ No history file found!");
    return;
  }

  console.log(`\n==================================================`);
  console.log(`READING TELEGRAM EXPORT: ${targetPath}`);
  console.log(`==================================================\n`);

  const raw = fs.readFileSync(targetPath, "utf-8");
  let allParsedSessions: any[] = [];

  if (targetPath.endsWith(".json")) {
    const data = JSON.parse(raw);
    const messages = Array.isArray(data.messages) ? data.messages : [];
    console.log(`Total messages in export: ${messages.length}`);

    for (const msg of messages) {
      let textStr = "";
      if (Array.isArray(msg.text)) {
        textStr = msg.text
          .map((item: any) => (typeof item === "string" ? item : item?.text || ""))
          .join("");
      } else if (typeof msg.text === "string") {
        textStr = msg.text;
      }

      if (textStr.includes("Visitor Session Report") || (textStr.includes("Session:") && textStr.includes("Active Time:"))) {
        const sessions = parseTelegramReports(textStr);
        for (const s of sessions) {
          if (msg.date_unixtime) {
            const unixMs = Number(msg.date_unixtime) * 1000;
            s.createdAt = unixMs - (s.sessionLifetime || 0) * 1000;
            s.lastActivityAt = unixMs;
          } else if (msg.date) {
            const parsedDate = new Date(msg.date).getTime();
            if (!isNaN(parsedDate)) {
              s.createdAt = parsedDate - (s.sessionLifetime || 0) * 1000;
              s.lastActivityAt = parsedDate;
            }
          }
          if (msg.id) {
            s.telegramMessageId = Number(msg.id);
          }
          allParsedSessions.push(s);
        }
      }
    }
  } else {
    allParsedSessions = parseTelegramReports(raw);
  }

  console.log(`\nParsed ${allParsedSessions.length} total visitor session reports.`);
  if (allParsedSessions.length === 0) {
    console.log("No visitor sessions found.");
    return;
  }

  // Deduplicate by sessionId (taking the latest state for each session)
  const sessionMap = new Map<string, any>();
  for (const s of allParsedSessions) {
    const existing = sessionMap.get(s.sessionId);
    if (!existing || (s.lastActivityAt >= existing.lastActivityAt)) {
      sessionMap.set(s.sessionId, s);
    }
  }

  const uniqueSessions = Array.from(sessionMap.values());
  console.log(`Deduplicated into ${uniqueSessions.length} unique sessions.`);

  await initDbTables();

  console.log(`\nImporting into Neon PostgreSQL...`);
  let importedCount = 0;
  for (const s of uniqueSessions) {
    await saveOrUpdateSession(s);
    importedCount++;
    if (importedCount % 10 === 0 || importedCount === uniqueSessions.length) {
      console.log(`Saved ${importedCount}/${uniqueSessions.length} sessions...`);
    }
  }

  const stats = await getDashboardStats("all");

  console.log(`\n==================================================`);
  console.log(`🎉 IMPORT COMPLETE! POSTGRES DATABASE UPDATED`);
  console.log(`==================================================`);
  console.log(`• Total Unique Visitors (All Time): ${stats.totalTraffic.allTimeUniqueVisitors}`);
  console.log(`• Total Sessions (All Time): ${stats.totalTraffic.allTimeTotalVisits}`);
  console.log(`• Total Active Time (All Time): ${stats.totalTime.allTimeHumanActiveTime}`);
  console.log(`• Total Session Lifetime (All Time): ${stats.totalTime.allTimeTotalLifetime}`);
  console.log(`• Average Active Time: ${stats.totalTime.allTimeAvgActiveTime}`);
  console.log(`• Top Visited Pages:`);
  stats.topPages.slice(0, 5).forEach((p, i) => console.log(`   ${i + 1}. ${p.path} (${p.views} views)`));
  console.log(`• Top Countries:`);
  stats.countries.slice(0, 5).forEach((c, i) => console.log(`   ${i + 1}. ${c.country} (${c.count} sessions)`));
  console.log(`==================================================\n`);
}

runJsonImport().catch(console.error);
