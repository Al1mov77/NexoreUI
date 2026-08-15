import { NextResponse } from "next/server";
import { getDashboardStats } from "../../../lib/analytics-store";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type TimePeriod = "today" | "7d" | "30d" | "all";

// Helper to render Inline Keyboards for Telegram Bot
function buildDashboardKeyboard(currentPeriod: TimePeriod = "today") {
  const periodLabelMap: Record<TimePeriod, string> = {
    today: "Today ✅",
    "7d": "7 Days",
    "30d": "30 Days",
    all: "All Time",
  };

  return {
    inline_keyboard: [
      [
        { text: "📊 Total Traffic", callback_data: `nav_traffic_${currentPeriod}` },
        { text: "⏱ Total Time", callback_data: `nav_time_${currentPeriod}` },
      ],
      [
        { text: "🔥 Top Sessions", callback_data: `nav_sessions_${currentPeriod}` },
        { text: "📄 Top Pages", callback_data: `nav_pages_${currentPeriod}` },
      ],
      [
        { text: "🧩 Components", callback_data: `nav_components_${currentPeriod}` },
        { text: "📋 Copy Code", callback_data: `nav_copy_${currentPeriod}` },
      ],
      [
        { text: "🤖 AI Activity", callback_data: `nav_ai_${currentPeriod}` },
        { text: "🎬 YouTube", callback_data: `nav_youtube_${currentPeriod}` },
      ],
      [
        { text: "🤖 Bot Traffic", callback_data: `nav_bots_${currentPeriod}` },
        { text: "🌍 Countries", callback_data: `nav_countries_${currentPeriod}` },
      ],
      [
        { text: "🏙 Cities", callback_data: `nav_cities_${currentPeriod}` },
        { text: "🔴 Live Now", callback_data: `nav_live_${currentPeriod}` },
      ],
      [
        {
          text: currentPeriod === "today" ? "Period: Today 🔘" : "Today",
          callback_data: "period_today",
        },
        {
          text: currentPeriod === "7d" ? "Period: 7D 🔘" : "7 Days",
          callback_data: "period_7d",
        },
        {
          text: currentPeriod === "30d" ? "Period: 30D 🔘" : "30 Days",
          callback_data: "period_30d",
        },
        {
          text: currentPeriod === "all" ? "Period: All 🔘" : "All Time",
          callback_data: "period_all",
        },
      ],
      [{ text: "🏠 Main Menu", callback_data: `nav_menu_${currentPeriod}` }],
    ],
  };
}

function renderFormattedMessage(action: string, period: TimePeriod): string {
  const stats = getDashboardStats(period);
  const periodNameMap: Record<TimePeriod, string> = {
    today: "Today",
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    all: "All Time",
  };
  const pName = periodNameMap[period];

  switch (action) {
    case "menu":
      return (
        `📊 <b>NexoreUI Analytics Dashboard</b>\n` +
        `<i>Period: ${pName}</i>\n\n` +
        `Select a metric button below to explore live stats:\n` +
        `• <b>Total Visits:</b> ${stats.totalTraffic.totalVisits}\n` +
        `• <b>Human Sessions:</b> ${stats.totalTraffic.humanSessions}\n` +
        `• <b>Bot Sessions:</b> ${stats.totalTraffic.botSessions}\n` +
        `• <b>Human Active Time:</b> ${stats.totalTime.totalHumanActiveTime}\n` +
        `• <b>Live Now:</b> ${stats.liveNow.count} active session(s)`
      );

    case "traffic":
      return (
        `📊 <b>TOTAL TRAFFIC REPORT</b> (${pName})\n\n` +
        `• <b>Total Visits:</b> ${stats.totalTraffic.totalVisits}\n` +
        `• <b>Unique Visitors:</b> ${stats.totalTraffic.uniqueVisitors}\n` +
        `• <b>Human Sessions:</b> ${stats.totalTraffic.humanSessions} (${stats.totalTraffic.uniqueHumanVisitors} unique)\n` +
        `• <b>Bot Sessions:</b> ${stats.totalTraffic.botSessions}\n` +
        `• <b>Unknown Sessions:</b> ${stats.totalTraffic.unknownSessions}\n` +
        `• <b>Visits Today:</b> ${stats.totalTraffic.sessionsToday}`
      );

    case "time":
      return (
        `⏱ <b>TOTAL TIME & DURATION REPORT</b> (${pName})\n\n` +
        `• <b>Total Human Active Time:</b> ${stats.totalTime.totalHumanActiveTime}\n` +
        `• <b>Average Session Active Time:</b> ${stats.totalTime.avgSessionActiveTime}\n` +
        `• <b>Total Sessions Evaluated:</b> ${stats.totalTime.totalSessions}`
      );

    case "sessions": {
      if (stats.topActiveSessions.length === 0) {
        return `🔥 <b>TOP ACTIVE SESSIONS</b> (${pName})\n\n<i>No active human sessions recorded yet.</i>`;
      }
      const medalMap = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
      const list = stats.topActiveSessions
        .map(
          (s, i) =>
            `${medalMap[i] || "•"} <b>Session:</b> <code>${s.sessionId}</code>\n` +
            `   ⚡ <b>Active Time:</b> ${s.activeTime}\n` +
            `   📄 <b>Pages Visited:</b> ${s.pagesCount}\n` +
            `   ${s.location}\n` +
            `   🔗 <b>Source:</b> ${s.trafficSource}`
        )
        .join("\n\n");
      return `🔥 <b>TOP ACTIVE SESSIONS</b> (${pName})\n\n${list}\n\n<i>⚠️ Ranked strictly by active interaction time (No IP addresses stored).</i>`;
    }

    case "pages": {
      if (stats.topPages.length === 0) {
        return `📄 <b>TOP PAGES</b> (${pName})\n\n<i>No page views recorded yet.</i>`;
      }
      const list = stats.topPages
        .map((p, i) => `${i + 1}. <code>${p.path}</code>\n   👀 ${p.views} views (${p.uniqueVisitors} unique) | ⚡ avg ${p.avgActiveTime}`)
        .join("\n\n");
      return `📄 <b>TOP PAGES BY HUMAN VIEWS</b> (${pName})\n\n${list}`;
    }

    case "components": {
      if (stats.topComponents.length === 0) {
        return `🧩 <b>TOP COMPONENTS</b> (${pName})\n\n<i>No component activity recorded yet.</i>`;
      }
      const list = stats.topComponents
        .map((c, i) => `${i + 1}. <b>${c.component}</b>\n   📋 ${c.copies} code copies | 👀 ${c.views} page views`)
        .join("\n\n");
      return `🧩 <b>TOP COMPONENTS INTEREST</b> (${pName})\n\n${list}`;
    }

    case "copy": {
      const topCopied =
        stats.copyCode.topCopiedComponents.length > 0
          ? stats.copyCode.topCopiedComponents.map((c) => `  • <b>${c.component}:</b> ${c.copies} copies`).join("\n")
          : "  <i>No components copied yet</i>";
      return (
        `📋 <b>CODE COPY STATS</b> (${pName})\n\n` +
        `• <b>Total Code Copies:</b> ${stats.copyCode.totalCopies}\n` +
        `• <b>Unique Copying Visitors:</b> ${stats.copyCode.uniqueCopyVisitors}\n\n` +
        `<b>Top Copied Components:</b>\n${topCopied}`
      );
    }

    case "ai":
      return (
        `🤖 <b>AI ACTIVITY (Nexore Make)</b> (${pName})\n\n` +
        `• <b>AI Panel Opens:</b> ${stats.aiActivity.aiOpens}\n` +
        `• <b>Prompts Submitted:</b> ${stats.aiActivity.aiPromptsSubmitted}\n` +
        `• <b>Generations Started:</b> ${stats.aiActivity.aiGenStarted}\n` +
        `• <b>Generations Completed:</b> ${stats.aiActivity.aiGenCompleted}\n` +
        `• <b>Generations Failed:</b> ${stats.aiActivity.aiGenFailed}\n` +
        `• <b>Unique AI Users:</b> ${stats.aiActivity.uniqueAiUsers}\n\n` +
        `<i>🔒 Privacy Protected: Prompt text is NEVER logged or saved.</i>`
      );

    case "youtube": {
      const campaigns =
        stats.youtube.campaigns.length > 0 ? stats.youtube.campaigns.join(", ") : "None specified";
      return (
        `🎬 <b>YOUTUBE TRAFFIC ATTRIBUTION</b> (${pName})\n\n` +
        `• <b>YouTube Visitors:</b> ${stats.youtube.visitorsCount}\n` +
        `• <b>Total YouTube Sessions:</b> ${stats.youtube.sessionsCount}\n` +
        `• <b>Active Time:</b> ${stats.youtube.activeTime}\n` +
        `• <b>Campaigns:</b> ${campaigns}\n\n` +
        `<b>Funnel Conversions:</b>\n` +
        `  1️⃣ <b>Visitors:</b> ${stats.youtube.visitorsCount}\n` +
        `  2️⃣ <b>Code Copies:</b> ${stats.youtube.copyCount}\n` +
        `  3️⃣ <b>AI Generations:</b> ${stats.youtube.aiGenCount}`
      );
    }

    case "bots": {
      const topLocs =
        stats.botTraffic.topBotLocations.length > 0
          ? stats.botTraffic.topBotLocations.map((b) => `  • ${b.location}: ${b.count} requests`).join("\n")
          : "  <i>None detected</i>";
      const top404 =
        stats.botTraffic.topInvalidRoutes.length > 0
          ? stats.botTraffic.topInvalidRoutes.map((r) => `  • <code>${r.path}</code>: ${r.count} hits`).join("\n")
          : "  <i>None detected</i>";

      return (
        `🤖 <b>BOT TRAFFIC & SCANNER REPORT</b> (${pName})\n\n` +
        `• <b>Bot Sessions Identified:</b> ${stats.botTraffic.botSessionsCount}\n` +
        `• <b>High Likelihood Crawlers:</b> ${stats.botTraffic.crawlerSessionsCount}\n` +
        `• <b>404 Invalid Route Scans:</b> ${stats.botTraffic.total404Scans}\n\n` +
        `<b>Top Bot Locations:</b>\n${topLocs}\n\n` +
        `<b>Most Requested Invalid Routes (404 Scanners):</b>\n${top404}`
      );
    }

    case "countries": {
      if (stats.countries.length === 0) {
        return `🌍 <b>TOP COUNTRIES</b> (${pName})\n\n<i>No country data available.</i>`;
      }
      const list = stats.countries.map((c, i) => `${i + 1}. ${c.country} — ${c.count} session(s)`).join("\n");
      return `🌍 <b>TOP HUMAN TRAFFIC COUNTRIES</b> (${pName})\n\n${list}`;
    }

    case "cities": {
      if (stats.cities.length === 0) {
        return `🏙 <b>TOP CITIES</b> (${pName})\n\n<i>No city data available.</i>`;
      }
      const list = stats.cities.map((c, i) => `${i + 1}. 📍 ${c.city} — ${c.count} session(s)`).join("\n");
      return `🏙 <b>TOP HUMAN TRAFFIC CITIES</b> (${pName})\n\n${list}`;
    }

    case "live": {
      if (stats.liveNow.count === 0) {
        return `🔴 <b>LIVE NOW</b>\n\n<i>No users active in the last 5 minutes.</i>`;
      }
      const list = stats.liveNow.sessions
        .map(
          (s, i) =>
            `${i + 1}. <code>${s.sessionId}</code>\n   ${s.location} (${s.device})\n   📄 Current Page: <code>${s.lastPage}</code>\n   ⚡ Active: ${s.activeTime}`
        )
        .join("\n\n");
      return `🔴 <b>LIVE ACTIVE SESSIONS (${stats.liveNow.count})</b>\n\n${list}`;
    }

    default:
      return `📊 <b>NexoreUI Analytics</b>\nSelect an option from the menu.`;
  }
}

async function answerTelegramCallback(callbackQueryId: string, text?: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text || "Updated!",
      }),
    });
  } catch (e) {
    // ignore
  }
}

async function updateTelegramBotMessage(chatId: string | number, messageId: number, textHtml: string, period: TimePeriod) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: textHtml,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: buildDashboardKeyboard(period),
      }),
    });
  } catch (e) {
    console.error("Telegram bot edit error:", e);
  }
}

async function sendTelegramBotMessage(chatId: string | number, textHtml: string, period: TimePeriod) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: textHtml,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: buildDashboardKeyboard(period),
      }),
    });
  } catch (e) {
    console.error("Telegram bot send error:", e);
  }
}

// ----------------------------------------------------
// GET /api/telegram: HTTP API for external stats / debug
// ----------------------------------------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "menu";
  const period = (searchParams.get("period") || "today") as TimePeriod;

  const stats = getDashboardStats(period);
  return NextResponse.json({
    success: true,
    action,
    period,
    stats,
  });
}

// ----------------------------------------------------
// POST /api/telegram: Telegram Bot Webhook Handler
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    const update = await req.json();

    // 1. Handle Inline Keyboard Button Callbacks
    if (update.callback_query) {
      const cb = update.callback_query;
      const callbackId = cb.id;
      const data: string = cb.data || "";
      const messageId = cb.message?.message_id;
      const chatId = cb.message?.chat?.id;

      await answerTelegramCallback(callbackId);

      let action = "menu";
      let period: TimePeriod = "today";

      if (data.startsWith("nav_")) {
        const parts = data.split("_");
        action = parts[1] || "menu";
        period = (parts[2] as TimePeriod) || "today";
      } else if (data.startsWith("period_")) {
        period = (data.split("_")[1] as TimePeriod) || "today";
        action = "menu";
      }

      const textHtml = renderFormattedMessage(action, period);
      if (chatId && messageId) {
        await updateTelegramBotMessage(chatId, messageId, textHtml, period);
      }
      return NextResponse.json({ success: true });
    }

    // 2. Handle Text Messages & Bot Commands (/start, /stats, /menu)
    if (update.message && update.message.text) {
      const msgText: string = update.message.text.trim();
      const chatId = update.message.chat.id;

      let action = "menu";
      let period: TimePeriod = "today";

      if (msgText.startsWith("/stats") || msgText.startsWith("/analytics")) {
        action = "menu";
      } else if (msgText.startsWith("/live")) {
        action = "live";
      } else if (msgText.startsWith("/bots")) {
        action = "bots";
      }

      const textHtml = renderFormattedMessage(action, period);
      await sendTelegramBotMessage(chatId, textHtml, period);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, ignored: true });
  } catch (err: any) {
    console.error("Telegram Webhook Error:", err);
    return NextResponse.json({ success: false, error: "Webhook Error" }, { status: 500 });
  }
}
