import { NextResponse } from "next/server";
import { getDashboardStats } from "../../../lib/analytics-store";
import { buildDashboardKeyboard, buildChatReplyKeyboard, TimePeriod } from "../../../lib/telegram-keyboard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function renderFormattedMessage(action: string, period: TimePeriod = "all"): Promise<string> {
  const stats = await getDashboardStats(period);
  const periodNameMap: Record<TimePeriod, string> = {
    today: "Сегодня (Today)",
    "7d": "Последние 7 дней (7 Days)",
    "30d": "Последние 30 дней (30 Days)",
    all: "Все время (All Time)",
  };
  const pName = periodNameMap[period];

  switch (action) {
    case "menu":
      return (
        `📊 <b>NexoreUI Analytics Dashboard</b>\n` +
        `<i>Период: ${pName}</i>\n\n` +
        `👥 <b>Посетители (Visitors):</b>\n` +
        `• <b>Всего за все время:</b> ${stats.totalTraffic.allTimeUniqueVisitors} уникальных (${stats.totalTraffic.allTimeTotalVisits} сессий)\n` +
        `• <b>За выбранный период (${pName}):</b> ${stats.totalTraffic.uniqueVisitors} уникальных (${stats.totalTraffic.totalVisits} сессий)\n` +
        `• <b>Визитов сегодня:</b> ${stats.totalTraffic.uniqueVisitorsToday} уникальных (${stats.totalTraffic.sessionsToday} сессий)\n\n` +
        `⏱ <b>Активное время взаимодействия:</b>\n` +
        `• <b>За все время (С самого начала):</b> ${stats.totalTime.allTimeHumanActiveTime}\n` +
        `• <b>За выбранный период:</b> ${stats.totalTime.totalHumanActiveTime}\n` +
        `• <b>Среднее на сессию:</b> ${stats.totalTime.avgSessionActiveTime}\n\n` +
        `🤖 <b>Бот-сессии:</b> ${stats.totalTraffic.botSessions}\n` +
        `🔴 <b>Сейчас онлайн:</b> ${stats.liveNow.count} активных`
      );

    case "traffic":
      return (
        `📊 <b>TOTAL TRAFFIC REPORT</b> (${pName})\n\n` +
        `🌐 <b>С самого начала (All Time):</b>\n` +
        `• <b>Уникальных посетителей:</b> ${stats.totalTraffic.allTimeUniqueVisitors}\n` +
        `• <b>Всего сессий:</b> ${stats.totalTraffic.allTimeTotalVisits}\n` +
        `• <b>Реальных посетителей:</b> ${stats.totalTraffic.allTimeUniqueHumanVisitors} (${stats.totalTraffic.allTimeHumanSessions} сессий)\n\n` +
        `📅 <b>За выбранный период (${pName}):</b>\n` +
        `• <b>Всего визитов:</b> ${stats.totalTraffic.totalVisits}\n` +
        `• <b>Уникальных посетителей:</b> ${stats.totalTraffic.uniqueVisitors}\n` +
        `• <b>Реальных сессий:</b> ${stats.totalTraffic.humanSessions} (${stats.totalTraffic.uniqueHumanVisitors} уникальных)\n` +
        `• <b>Бот-сессий:</b> ${stats.totalTraffic.botSessions}\n` +
        `• <b>Неизвестных:</b> ${stats.totalTraffic.unknownSessions}\n` +
        `• <b>Визитов сегодня:</b> ${stats.totalTraffic.sessionsToday} (${stats.totalTraffic.uniqueVisitorsToday} уникальных)`
      );

    case "time":
      return (
        `⏱ <b>TOTAL TIME & DURATION REPORT</b>\n\n` +
        `⏳ <b>С самого начала (All Time):</b>\n` +
        `• <b>Общее активное время:</b> ${stats.totalTime.allTimeHumanActiveTime}\n` +
        `• <b>Общее время жизни сессий:</b> ${stats.totalTime.allTimeTotalLifetime}\n` +
        `• <b>Среднее время на сессию:</b> ${stats.totalTime.allTimeAvgActiveTime}\n` +
        `• <b>Всего сессий за все время:</b> ${stats.totalTime.allTimeTotalSessions}\n` +
        `• <b>Уникальных посетителей:</b> ${stats.totalTime.allTimeUniqueHumanVisitors}\n\n` +
        `📅 <b>За выбранный период (${pName}):</b>\n` +
        `• <b>Активное время:</b> ${stats.totalTime.totalHumanActiveTime}\n` +
        `• <b>Среднее активное время:</b> ${stats.totalTime.avgSessionActiveTime}\n` +
        `• <b>Оценено сессий:</b> ${stats.totalTime.totalSessions}`
      );

    case "sessions": {
      if (stats.topActiveSessions.length === 0) {
        return `🔥 <b>TOP ACTIVE SESSIONS</b> (${pName})\n\n<i>Нет записанных сессий за этот период.</i>`;
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
      return `🔥 <b>TOP ACTIVE SESSIONS</b> (${pName})\n\n${list}\n\n<i>⚠️ Ранжировано строго по активному взаимодействию.</i>`;
    }

    case "pages": {
      if (stats.topPages.length === 0) {
        return `📄 <b>TOP PAGES</b> (${pName})\n\n<i>Нет просмотров страниц за этот период.</i>`;
      }
      const list = stats.topPages
        .map((p, i) => `${i + 1}. <code>${p.path}</code>\n   👀 ${p.views} просмотров (${p.uniqueVisitors} уникальных) | ⚡ среднее ${p.avgActiveTime}`)
        .join("\n\n");
      return `📄 <b>TOP PAGES BY HUMAN VIEWS</b> (${pName})\n\n${list}`;
    }

    case "components": {
      if (stats.topComponents.length === 0) {
        return `🧩 <b>TOP COMPONENTS</b> (${pName})\n\n<i>Нет активности по компонентам за этот период.</i>`;
      }
      const list = stats.topComponents
        .map((c, i) => `${i + 1}. <b>${c.component}</b>\n   📋 ${c.copies} копирований кода | 👀 ${c.views} просмотров страницы`)
        .join("\n\n");
      return `🧩 <b>TOP COMPONENTS INTEREST</b> (${pName})\n\n${list}`;
    }

    case "copy": {
      const topCopied =
        stats.copyCode.topCopiedComponents.length > 0
          ? stats.copyCode.topCopiedComponents.map((c) => `  • <b>${c.component}:</b> ${c.copies} раз`).join("\n")
          : "  <i>Нет копирований за этот период</i>";
      return (
        `📋 <b>CODE COPY STATS</b> (${pName})\n\n` +
        `• <b>Всего копирований кода:</b> ${stats.copyCode.totalCopies}\n` +
        `• <b>Уникальных копировавших:</b> ${stats.copyCode.uniqueCopyVisitors}\n\n` +
        `<b>Топ копируемых компонентов:</b>\n${topCopied}`
      );
    }

    case "ai":
      return (
        `🤖 <b>AI ACTIVITY (Nexore Make)</b> (${pName})\n\n` +
        `• <b>Открытий панели AI:</b> ${stats.aiActivity.aiOpens}\n` +
        `• <b>Отправлено промптов:</b> ${stats.aiActivity.aiPromptsSubmitted}\n` +
        `• <b>Генераций начато:</b> ${stats.aiActivity.aiGenStarted}\n` +
        `• <b>Генераций успешно завершено:</b> ${stats.aiActivity.aiGenCompleted}\n` +
        `• <b>Ошибок генерации:</b> ${stats.aiActivity.aiGenFailed}\n` +
        `• <b>Уникальных AI-пользователей:</b> ${stats.aiActivity.uniqueAiUsers}\n\n` +
        `<i>🔒 Privacy Protected: Текст промптов НИКОГДА не сохраняется.</i>`
      );

    case "youtube": {
      const campaigns =
        stats.youtube.campaigns.length > 0 ? stats.youtube.campaigns.join(", ") : "Не указаны";
      return (
        `🎬 <b>YOUTUBE TRAFFIC ATTRIBUTION</b> (${pName})\n\n` +
        `• <b>YouTube Visitors:</b> ${stats.youtube.visitorsCount}\n` +
        `• <b>Total YouTube Sessions:</b> ${stats.youtube.sessionsCount}\n` +
        `• <b>Active Time:</b> ${stats.youtube.activeTime}\n` +
        `• <b>Кампании (UTM):</b> ${campaigns}\n\n` +
        `<b>Воронка конверсий:</b>\n` +
        `  1️⃣ <b>Посетители:</b> ${stats.youtube.visitorsCount}\n` +
        `  2️⃣ <b>Копирования кода:</b> ${stats.youtube.copyCount}\n` +
        `  3️⃣ <b>AI Генерации:</b> ${stats.youtube.aiGenCount}`
      );
    }

    case "bots": {
      const topLocs =
        stats.botTraffic.topBotLocations.length > 0
          ? stats.botTraffic.topBotLocations.map((b) => `  • ${b.location}: ${b.count} запросов`).join("\n")
          : "  <i>Не обнаружено</i>";
      const top404 =
        stats.botTraffic.topInvalidRoutes.length > 0
          ? stats.botTraffic.topInvalidRoutes.map((r) => `  • <code>${r.path}</code>: ${r.count} обращений`).join("\n")
          : "  <i>Не обнаружено</i>";

      return (
        `🤖 <b>BOT TRAFFIC & SCANNER REPORT</b> (${pName})\n\n` +
        `• <b>Определено бот-сессий:</b> ${stats.botTraffic.botSessionsCount}\n` +
        `• <b>Краулеры/парсеры:</b> ${stats.botTraffic.crawlerSessionsCount}\n` +
        `• <b>404 Сканирование роутов:</b> ${stats.botTraffic.total404Scans}\n\n` +
        `<b>Топ локаций ботов:</b>\n${topLocs}\n\n` +
        `<b>Частые 404 роуты (сканеры уязвимостей):</b>\n${top404}`
      );
    }

    case "countries": {
      if (stats.countries.length === 0) {
        return `🌍 <b>TOP COUNTRIES</b> (${pName})\n\n<i>Нет данных по странам за этот период.</i>`;
      }
      const list = stats.countries.map((c, i) => `${i + 1}. ${c.country} — ${c.count} сессий`).join("\n");
      return `🌍 <b>TOP HUMAN TRAFFIC COUNTRIES</b> (${pName})\n\n${list}`;
    }

    case "cities": {
      if (stats.cities.length === 0) {
        return `🏙 <b>TOP CITIES</b> (${pName})\n\n<i>Нет данных по городам за этот период.</i>`;
      }
      const list = stats.cities.map((c, i) => `${i + 1}. 📍 ${c.city} — ${c.count} сессий`).join("\n");
      return `🏙 <b>TOP HUMAN TRAFFIC CITIES</b> (${pName})\n\n${list}`;
    }

    case "live": {
      if (stats.liveNow.count === 0) {
        return `🔴 <b>LIVE NOW</b>\n\n<i>Сейчас нет активных пользователей за последние 5 минут.</i>`;
      }
      const list = stats.liveNow.sessions
        .map(
          (s, i) =>
            `${i + 1}. <code>${s.sessionId}</code>\n   ${s.location} (${s.device})\n   📄 Текущая страница: <code>${s.lastPage}</code>\n   ⚡ Активно: ${s.activeTime}`
        )
        .join("\n\n");
      return `🔴 <b>LIVE ACTIVE SESSIONS (${stats.liveNow.count})</b>\n\n${list}`;
    }

    default:
      return `📊 <b>NexoreUI Analytics Dashboard</b>\nВыберите раздел в меню или используйте быстрые кнопки внизу.`;
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

async function updateTelegramBotMessage(chatId: string | number, messageId: number, textHtml: string, period: TimePeriod, action: string = "menu") {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: String(chatId),
        message_id: messageId,
        text: textHtml,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: buildDashboardKeyboard(period, action),
      }),
    });
    const data = await res.json();
    if (!data.ok && data.description?.includes("message is not modified")) {
      return;
    }
  } catch (e) {
    console.error("Telegram bot edit error:", e);
  }
}

async function sendTelegramBotMessage(
  chatId: string | number,
  textHtml: string,
  period: TimePeriod = "all",
  action: string = "menu",
  withReplyKeyboard: boolean = false
) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    // If withReplyKeyboard is requested (e.g. /start or menu command), send reply keyboard first/with it
    if (withReplyKeyboard) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: String(chatId),
          text: "⌨️ Быстрые кнопки аналитики активированы внизу чата:",
          parse_mode: "HTML",
          reply_markup: buildChatReplyKeyboard(period),
        }),
      });
    }

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: String(chatId),
        text: textHtml,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: buildDashboardKeyboard(period, action),
      }),
    });
  } catch (e) {
    console.error("Telegram bot send error:", e);
  }
}

// ----------------------------------------------------
// GET /api/telegram: HTTP API & Webhook Config
// ----------------------------------------------------
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "menu";
  const period = (searchParams.get("period") || "all") as TimePeriod;
  const webhookUrl = searchParams.get("set_webhook");

  if (webhookUrl && TELEGRAM_BOT_TOKEN) {
    try {
      const setRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
      const setData = await setRes.json();
      return NextResponse.json({ success: setData.ok, result: setData });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  const stats = await getDashboardStats(period);
  const formattedText = await renderFormattedMessage(action, period);

  return NextResponse.json({
    success: true,
    action,
    period,
    formattedText,
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
      const chatId = cb.message?.chat?.id || cb.from?.id;

      await answerTelegramCallback(callbackId);

      let action = "menu";
      let period: TimePeriod = "all";

      if (data.startsWith("nav_")) {
        const parts = data.split("_");
        action = parts[1] || "menu";
        period = (parts[2] as TimePeriod) || "all";
      } else if (data.startsWith("period_")) {
        period = (data.split("_")[1] as TimePeriod) || "all";
        action = "menu";
      }

      const textHtml = await renderFormattedMessage(action, period);
      if (chatId && messageId) {
        await updateTelegramBotMessage(chatId, messageId, textHtml, period, action);
      }
      return NextResponse.json({ success: true });
    }

    // 2. Handle Text Messages & Bot Commands from Reply Keyboard or Chat Input
    if (update.message && update.message.text) {
      const rawText: string = update.message.text.trim();
      const msgText: string = rawText.toLowerCase();
      const chatId = update.message.chat.id;

      let action = "menu";
      let period: TimePeriod = "all";
      let isInitCommand = false;

      // Check period switch buttons
      if (msgText.includes("all time") || msgText === "/all" || msgText.includes("с начала") || msgText.includes("за все время")) {
        period = "all";
        action = "menu";
      } else if (msgText.includes("today") || msgText === "/today" || msgText.includes("сегодня")) {
        period = "today";
        action = "menu";
      } else if (msgText.includes("7 days") || msgText.includes("7 day") || msgText === "/7d" || msgText.includes("7 дней")) {
        period = "7d";
        action = "menu";
      } else if (msgText.includes("30 days") || msgText.includes("30 day") || msgText === "/30d" || msgText.includes("30 дней")) {
        period = "30d";
        action = "menu";
      } else if (msgText.includes("traffic") || msgText === "/traffic") {
        action = "traffic";
      } else if (msgText.includes("time") || msgText.includes("duration") || msgText === "/time") {
        action = "time";
      } else if (msgText.includes("session") || msgText === "/sessions") {
        action = "sessions";
      } else if (msgText.includes("page") || msgText === "/pages") {
        action = "pages";
      } else if (msgText.includes("component") || msgText === "/components") {
        action = "components";
      } else if (msgText.includes("copy") || msgText === "/copy") {
        action = "copy";
      } else if (msgText.includes("ai") || msgText === "/ai") {
        action = "ai";
      } else if (msgText.includes("youtube") || msgText === "/youtube") {
        action = "youtube";
      } else if (msgText.includes("bot") || msgText === "/bots") {
        action = "bots";
      } else if (msgText.includes("country") || msgText.includes("countries") || msgText === "/countries") {
        action = "countries";
      } else if (msgText.includes("city") || msgText.includes("cities") || msgText === "/cities") {
        action = "cities";
      } else if (msgText.includes("live") || msgText === "/live") {
        action = "live";
      } else if (msgText.startsWith("/start") || msgText.startsWith("/menu") || msgText.includes("main menu") || msgText === "/help") {
        action = "menu";
        period = "all";
        isInitCommand = true;
      }

      const textHtml = await renderFormattedMessage(action, period);
      await sendTelegramBotMessage(chatId, textHtml, period, action, isInitCommand);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, ignored: true });
  } catch (err: any) {
    console.error("Telegram Webhook Error:", err);
    return NextResponse.json({ success: false, error: "Webhook Error" }, { status: 500 });
  }
}

