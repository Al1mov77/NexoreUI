import { sql } from "@vercel/postgres";
import crypto from "crypto";

export interface PageViewRecord {
  path: string;
  enteredAt?: number;
  leftAt?: number;
  activeDuration: number;
  timeSpent: number;
  is404?: boolean;
}

export interface AnalyticsEventRecord {
  eventType: string;
  component?: string;
  framework?: string;
  feature?: string;
  status?: string;
  page?: string;
  timestamp: number;
}

export interface SessionRecord {
  visitorId: string;
  sessionId: string;
  createdAt: number;
  lastActivityAt: number;
  sessionLifetime: number;
  activeTime: number;
  inactiveTime: number;
  countryCode: string;
  countryName: string;
  city: string;
  locationStr: string;
  device: string;
  browser: string;
  os: string;
  trafficSource: string;
  referrer: string;
  utm: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
  humanScore: number;
  botLikelihood: "High" | "Medium" | "Low";
  humanLikelihood: "High" | "Medium" | "Low";
  trafficType: "Human" | "Bot" | "Unknown";
  isReturning: boolean;
  pages: PageViewRecord[];
  events: AnalyticsEventRecord[];
  telegramSent: boolean;
  telegramMessageId?: number | null;
  summaryHash?: string;
  anonymizedIp?: string;
}

// In-Memory Storage Fallback (used in dev or when DB connection is unconfigured)
const inMemorySessions = new Map<string, SessionRecord>();
const inMemoryVisitors = new Set<string>();

// Flag to track whether SQL tables have been verified
let tablesInitialized = false;

export async function initDbTables() {
  if (tablesInitialized || !process.env.POSTGRES_URL) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_visitors (
        visitor_id VARCHAR(255) PRIMARY KEY,
        first_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        session_id VARCHAR(255) PRIMARY KEY,
        visitor_id VARCHAR(255),
        created_at BIGINT,
        last_activity_at BIGINT,
        session_lifetime INTEGER,
        active_time INTEGER,
        inactive_time INTEGER,
        country_code VARCHAR(10),
        country_name VARCHAR(100),
        city VARCHAR(100),
        device VARCHAR(50),
        browser VARCHAR(50),
        os VARCHAR(50),
        traffic_source VARCHAR(100),
        referrer TEXT,
        utm_source VARCHAR(100),
        utm_campaign VARCHAR(100),
        human_score INTEGER,
        bot_likelihood VARCHAR(20),
        human_likelihood VARCHAR(20),
        traffic_type VARCHAR(20),
        is_returning BOOLEAN,
        telegram_sent BOOLEAN DEFAULT false,
        telegram_message_id INTEGER,
        summary_hash VARCHAR(128),
        anonymized_ip VARCHAR(100),
        data JSONB
      );
    `;
    tablesInitialized = true;
  } catch (e) {
    console.warn("Analytics DB init warning (using memory store fallback):", (e as any).message);
  }
}

export async function saveOrUpdateSession(record: SessionRecord): Promise<{ isNew: boolean; existingMessageId?: number | null }> {
  // Always update in-memory cache first
  inMemoryVisitors.add(record.visitorId);
  const existingInMemory = inMemorySessions.get(record.sessionId);
  const existingMessageId = existingInMemory?.telegramMessageId || record.telegramMessageId;
  
  if (existingMessageId) {
    record.telegramMessageId = existingMessageId;
  }
  
  inMemorySessions.set(record.sessionId, record);

  // Attempt DB persistence if configured
  if (process.env.POSTGRES_URL) {
    try {
      await initDbTables();
      const existing = await sql`SELECT telegram_message_id FROM analytics_sessions WHERE session_id = ${record.sessionId}`;
      
      const dbMessageId = existing.rows.length > 0 ? existing.rows[0].telegram_message_id : null;
      if (dbMessageId && !record.telegramMessageId) {
        record.telegramMessageId = dbMessageId;
      }

      await sql`
        INSERT INTO analytics_visitors (visitor_id, last_seen_at)
        VALUES (${record.visitorId}, CURRENT_TIMESTAMP)
        ON CONFLICT (visitor_id) DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP;
      `;

      const jsonData = JSON.stringify({
        pages: record.pages,
        events: record.events,
        utm: record.utm,
      });

      if (existing.rows.length > 0) {
        await sql`
          UPDATE analytics_sessions
          SET last_activity_at = ${record.lastActivityAt},
              session_lifetime = ${record.sessionLifetime},
              active_time = ${record.activeTime},
              inactive_time = ${record.inactiveTime},
              human_score = ${record.humanScore},
              bot_likelihood = ${record.botLikelihood},
              human_likelihood = ${record.humanLikelihood},
              traffic_type = ${record.trafficType},
              telegram_sent = ${record.telegramSent},
              telegram_message_id = ${record.telegramMessageId || null},
              summary_hash = ${record.summaryHash || null},
              data = ${jsonData}::jsonb
          WHERE session_id = ${record.sessionId};
        `;
        return { isNew: false, existingMessageId: dbMessageId };
      } else {
        await sql`
          INSERT INTO analytics_sessions (
            session_id, visitor_id, created_at, last_activity_at, session_lifetime, active_time, inactive_time,
            country_code, country_name, city, device, browser, os, traffic_source, referrer,
            utm_source, utm_campaign, human_score, bot_likelihood, human_likelihood, traffic_type,
            is_returning, telegram_sent, telegram_message_id, summary_hash, anonymized_ip, data
          ) VALUES (
            ${record.sessionId}, ${record.visitorId}, ${record.createdAt}, ${record.lastActivityAt},
            ${record.sessionLifetime}, ${record.activeTime}, ${record.inactiveTime},
            ${record.countryCode}, ${record.countryName}, ${record.city}, ${record.device}, ${record.browser},
            ${record.os}, ${record.trafficSource}, ${record.referrer},
            ${record.utm.utm_source || null}, ${record.utm.utm_campaign || null}, ${record.humanScore},
            ${record.botLikelihood}, ${record.humanLikelihood}, ${record.trafficType},
            ${record.isReturning}, ${record.telegramSent}, ${record.telegramMessageId || null},
            ${record.summaryHash || null}, ${record.anonymizedIp || null}, ${jsonData}::jsonb
          );
        `;
        return { isNew: true, existingMessageId: null };
      }
    } catch (e) {
      console.error("DB Save Error (using in-memory store):", (e as any).message);
    }
  }

  return { isNew: !existingInMemory, existingMessageId };
}

export function getAllSessions(): SessionRecord[] {
  return Array.from(inMemorySessions.values());
}

export function filterSessionsByPeriod(sessions: SessionRecord[], period: 'today' | '7d' | '30d' | 'all'): SessionRecord[] {
  const now = Date.now();
  if (period === 'today') {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayMs = startOfToday.getTime();
    return sessions.filter(s => s.createdAt >= todayMs || s.lastActivityAt >= todayMs);
  }
  if (period === '7d') {
    const ms7d = 7 * 24 * 60 * 60 * 1000;
    return sessions.filter(s => now - s.lastActivityAt <= ms7d);
  }
  if (period === '30d') {
    const ms30d = 30 * 24 * 60 * 60 * 1000;
    return sessions.filter(s => now - s.lastActivityAt <= ms30d);
  }
  return sessions;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}

// ----------------------------------------------------
// DASHBOARD STATS AGGREGATOR
// ----------------------------------------------------
export function getDashboardStats(period: 'today' | '7d' | '30d' | 'all' = 'today') {
  const allSessions = getAllSessions();
  const filtered = filterSessionsByPeriod(allSessions, period);

  const humanSessions = filtered.filter(s => s.trafficType === 'Human');
  const botSessions = filtered.filter(s => s.trafficType === 'Bot');
  const unknownSessions = filtered.filter(s => s.trafficType === 'Unknown');

  // 1. Total Traffic
  const uniqueVisitors = new Set(filtered.map(s => s.visitorId)).size;
  const uniqueHumanVisitors = new Set(humanSessions.map(s => s.visitorId)).size;
  
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();
  const sessionsToday = allSessions.filter(s => s.createdAt >= todayMs).length;

  // 2. Total Time
  const totalHumanActiveSeconds = humanSessions.reduce((acc, s) => acc + s.activeTime, 0);
  const avgSessionActiveSeconds = humanSessions.length > 0 ? Math.round(totalHumanActiveSeconds / humanSessions.length) : 0;

  // 3. Top Active Sessions (Ranked by activeTime, Human only, anonymous)
  const topActiveSessions = [...humanSessions]
    .sort((a, b) => b.activeTime - a.activeTime)
    .slice(0, 5)
    .map(s => ({
      sessionId: s.sessionId.substring(0, 8),
      visitorId: s.visitorId.substring(0, 8),
      activeTime: formatTime(s.activeTime),
      activeSeconds: s.activeTime,
      pagesCount: s.pages.length,
      location: s.locationStr,
      trafficSource: s.trafficSource,
    }));

  // 4. Top Pages (Human views only, excluding 404)
  const pageViewsMap: Record<string, { views: number; activeTime: number; uniqueVisitors: Set<string> }> = {};
  let total404Scans = 0;
  const requested404Routes: Record<string, number> = {};

  humanSessions.forEach(s => {
    s.pages.forEach(p => {
      if (p.is404 || p.path.includes("404")) {
        total404Scans++;
        requested404Routes[p.path] = (requested404Routes[p.path] || 0) + 1;
        return;
      }
      if (!pageViewsMap[p.path]) {
        pageViewsMap[p.path] = { views: 0, activeTime: 0, uniqueVisitors: new Set() };
      }
      pageViewsMap[p.path].views += 1;
      pageViewsMap[p.path].activeTime += p.activeDuration || p.timeSpent || 0;
      pageViewsMap[p.path].uniqueVisitors.add(s.visitorId);
    });
  });

  const topPages = Object.entries(pageViewsMap)
    .map(([path, data]) => ({
      path,
      views: data.views,
      uniqueVisitors: data.uniqueVisitors.size,
      avgActiveTime: data.views > 0 ? formatTime(Math.round(data.activeTime / data.views)) : "0s",
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // 5. Top Components
  const componentCopies: Record<string, number> = {};
  const componentViews: Record<string, number> = {};

  humanSessions.forEach(s => {
    s.events.forEach(e => {
      if (e.eventType === 'copy_code' && e.component) {
        componentCopies[e.component] = (componentCopies[e.component] || 0) + 1;
      }
    });
    s.pages.forEach(p => {
      if (p.path.startsWith('/docs/components/')) {
        const compName = p.path.replace('/docs/components/', '');
        const formattedName = compName.charAt(0).toUpperCase() + compName.slice(1);
        componentViews[formattedName] = (componentViews[formattedName] || 0) + 1;
      }
    });
  });

  const topComponents = Object.keys({ ...componentCopies, ...componentViews })
    .map(comp => ({
      component: comp,
      views: componentViews[comp] || 0,
      copies: componentCopies[comp] || 0,
    }))
    .sort((a, b) => (b.copies * 2 + b.views) - (a.copies * 2 + a.views))
    .slice(0, 10);

  // 6. Copy Code Stats
  let totalCopies = 0;
  const uniqueCopyVisitors = new Set<string>();
  const copiedComponentsCount: Record<string, number> = {};

  humanSessions.forEach(s => {
    s.events.forEach(e => {
      if (e.eventType === 'copy_code') {
        totalCopies++;
        uniqueCopyVisitors.add(s.visitorId);
        if (e.component) {
          copiedComponentsCount[e.component] = (copiedComponentsCount[e.component] || 0) + 1;
        }
      }
    });
  });

  // 7. AI Activity (NO prompt text)
  let aiOpens = 0;
  let aiPromptsSubmitted = 0;
  let aiGenStarted = 0;
  let aiGenCompleted = 0;
  let aiGenFailed = 0;
  const uniqueAiVisitors = new Set<string>();

  humanSessions.forEach(s => {
    s.events.forEach(e => {
      if (e.eventType.startsWith('ai_')) {
        uniqueAiVisitors.add(s.visitorId);
        if (e.eventType === 'ai_opened') aiOpens++;
        else if (e.eventType === 'ai_prompt_submitted') aiPromptsSubmitted++;
        else if (e.eventType === 'ai_generation_started') aiGenStarted++;
        else if (e.eventType === 'ai_generation_completed') aiGenCompleted++;
        else if (e.eventType === 'ai_generation_failed') aiGenFailed++;
      }
    });
  });

  // 8. YouTube Attribution & Funnel
  const ytSessions = humanSessions.filter(s => 
    s.trafficSource.toLowerCase() === 'youtube' || 
    s.referrer.toLowerCase().includes('youtube.com') || 
    s.utm.utm_source?.toLowerCase() === 'youtube'
  );
  
  const ytTotalVisitors = new Set(ytSessions.map(s => s.visitorId)).size;
  const ytActiveTime = ytSessions.reduce((acc, s) => acc + s.activeTime, 0);
  const ytCopyCount = ytSessions.reduce((acc, s) => acc + s.events.filter(e => e.eventType === 'copy_code').length, 0);
  const ytAiCount = ytSessions.reduce((acc, s) => acc + s.events.filter(e => e.eventType === 'ai_generation_completed').length, 0);

  // 9. Bot Traffic & 404 Scanners
  botSessions.forEach(s => {
    s.pages.forEach(p => {
      if (p.is404 || p.path.includes("404")) {
        total404Scans++;
        requested404Routes[p.path] = (requested404Routes[p.path] || 0) + 1;
      }
    });
  });

  const crawlerSessionsCount = botSessions.filter(s => s.botLikelihood === 'High').length;
  const botLocations: Record<string, number> = {};
  botSessions.forEach(s => {
    const loc = s.locationStr || "Unknown";
    botLocations[loc] = (botLocations[loc] || 0) + 1;
  });

  // 10. Geographic Distribution (Human only)
  const countryCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  humanSessions.forEach(s => {
    if (s.countryName && s.countryName !== 'Unknown') {
      const flag = s.locationStr.split(' ').pop() || '';
      const key = `${s.countryName} ${flag}`.trim();
      countryCounts[key] = (countryCounts[key] || 0) + 1;
    }
    if (s.city && s.city !== 'Unknown') {
      const key = `${s.city}, ${s.countryName}`;
      cityCounts[key] = (cityCounts[key] || 0) + 1;
    }
  });

  // 11. Live Now (Active human sessions in last 5 minutes)
  const fiveMinAgo = Date.now() - (5 * 60 * 1000);
  const liveSessions = humanSessions.filter(s => s.lastActivityAt >= fiveMinAgo);

  return {
    period,
    totalTraffic: {
      totalVisits: filtered.length,
      uniqueVisitors,
      humanSessions: humanSessions.length,
      uniqueHumanVisitors,
      botSessions: botSessions.length,
      unknownSessions: unknownSessions.length,
      sessionsToday,
    },
    totalTime: {
      totalHumanActiveTime: formatTime(totalHumanActiveSeconds),
      avgSessionActiveTime: formatTime(avgSessionActiveSeconds),
      totalSessions: filtered.length,
    },
    topActiveSessions,
    topPages,
    topComponents,
    copyCode: {
      totalCopies,
      uniqueCopyVisitors: uniqueCopyVisitors.size,
      topCopiedComponents: Object.entries(copiedComponentsCount)
        .map(([comp, count]) => ({ component: comp, copies: count }))
        .sort((a, b) => b.copies - a.copies)
        .slice(0, 5),
    },
    aiActivity: {
      aiOpens,
      aiPromptsSubmitted,
      aiGenStarted,
      aiGenCompleted,
      aiGenFailed,
      uniqueAiUsers: uniqueAiVisitors.size,
    },
    youtube: {
      visitorsCount: ytTotalVisitors,
      sessionsCount: ytSessions.length,
      activeTime: formatTime(ytActiveTime),
      copyCount: ytCopyCount,
      aiGenCount: ytAiCount,
      campaigns: Array.from(new Set(ytSessions.map(s => s.utm.utm_campaign).filter(Boolean))),
    },
    botTraffic: {
      botSessionsCount: botSessions.length,
      crawlerSessionsCount,
      total404Scans,
      topBotLocations: Object.entries(botLocations)
        .map(([loc, count]) => ({ location: loc, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topInvalidRoutes: Object.entries(requested404Routes)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    },
    countries: Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    cities: Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    liveNow: {
      count: liveSessions.length,
      sessions: liveSessions.map(s => ({
        sessionId: s.sessionId.substring(0, 8),
        location: s.locationStr,
        lastPage: s.pages.length > 0 ? s.pages[s.pages.length - 1].path : "/",
        activeTime: formatTime(s.activeTime),
        device: s.device,
      })),
    },
  };
}
