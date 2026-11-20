import crypto from "crypto";
import type { NextRequest } from "next/server";
import { getDb } from "./license-store";

export type AuthEventType = "otp_send" | "otp_verify_fail";

interface RateLimitDecision {
  allowed: boolean;
  retryAfterSeconds?: number;
  error?: string;
  reason?: string;
}

interface MemoryEvent {
  eventType: AuthEventType;
  ipHash: string;
  emailHash: string;
  createdAt: number;
}

const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([
  "10minutemail.com",
  "10minutemail.net",
  "dispostable.com",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "harakirimail.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "mohmal.com",
  "sharklasers.com",
  "spam4.me",
  "temp-mail.io",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "throwaway.email",
  "trashmail.com",
  "trashmail.me",
  "trashmail.net",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

const OTP_SEND_LIMITS = {
  emailCooldownMs: 60 * 1000,
  emailPerHour: 4,
  emailPerDay: 8,
  ipPer15Min: 5,
  ipPerHour: 10,
  ipPerDay: 20,
  globalPerHour: 30,
  globalPerDay: 85,
} as const;

const OTP_VERIFY_FAIL_LIMITS = {
  ipPer15Min: 15,
  ipPerHour: 40,
} as const;

const globalRateStore = globalThis as unknown as {
  __nexore_auth_events?: MemoryEvent[];
  __nexore_last_spam_alert_at?: number;
};

if (!globalRateStore.__nexore_auth_events) {
  globalRateStore.__nexore_auth_events = [];
}

const memoryEvents = globalRateStore.__nexore_auth_events;

let rateTableInitialized = false;

async function ensureRateLimitTable() {
  if (rateTableInitialized) return;
  const db = getDb();
  if (!db) {
    rateTableInitialized = true;
    return;
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth_otp_events (
        id BIGSERIAL PRIMARY KEY,
        event_type VARCHAR(32) NOT NULL,
        ip_hash VARCHAR(64) NOT NULL,
        email_hash VARCHAR(64) NOT NULL,
        created_at BIGINT NOT NULL
      );
    `);
    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_auth_otp_events_type_time ON auth_otp_events (event_type, created_at DESC);`
    );
    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_auth_otp_events_ip_time ON auth_otp_events (event_type, ip_hash, created_at DESC);`
    );
    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_auth_otp_events_email_time ON auth_otp_events (event_type, email_hash, created_at DESC);`
    );
    rateTableInitialized = true;
  } catch {
    rateTableInitialized = true;
  }
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function getClientIp(req: NextRequest): string {
  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return "unknown";
}

export function validateAuthEmail(raw: unknown): { valid: boolean; email: string; error?: string } {
  if (typeof raw !== "string") {
    return { valid: false, email: "", error: "Please provide a valid email address." };
  }

  const email = raw.trim().toLowerCase();
  if (!email || email.length > 254 || /[\r\n\s]/.test(email)) {
    return { valid: false, email: "", error: "Please provide a valid email address." };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return { valid: false, email: "", error: "Please provide a valid email address." };
  }

  const [localPart, domain] = parts;
  if (!localPart || localPart.length > 64 || localPart.includes("..") || !domain) {
    return { valid: false, email: "", error: "Please provide a valid email address." };
  }

  const tld = domain.split(".").pop() ?? "";
  if (!EMAIL_PATTERN.test(email) || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, email: "", error: "Please provide a valid email address." };
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      email: "",
      error: "Temporary email addresses are not supported. Please use a permanent email or sign in with Google.",
    };
  }

  return { valid: true, email };
}

async function notifyAbuseAlert(reason: string, details: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId || chatId === "YOUR_CHAT_ID_HERE") return;

  const now = Date.now();
  const lastAlert = globalRateStore.__nexore_last_spam_alert_at ?? 0;
  if (now - lastAlert < 15 * 60 * 1000) return;
  globalRateStore.__nexore_last_spam_alert_at = now;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(4_000),
      body: JSON.stringify({
        chat_id: chatId,
        text: `[NexoreUI Auth Protection]\nBlocked OTP rate-limit event: ${reason}\n${details}`,
      }),
    });
  } catch {
    // Best-effort alert only
  }
}

function pruneMemoryEvents(now: number): void {
  const cutoff = now - 48 * 60 * 60 * 1000;
  while (memoryEvents.length > 0 && memoryEvents[0].createdAt < cutoff) {
    memoryEvents.shift();
  }
}

export async function recordAuthEvent(
  eventType: AuthEventType,
  ip: string,
  email: string
): Promise<void> {
  const now = Date.now();
  const ipHash = sha256(`ip:${ip}`);
  const emailHash = sha256(`email:${email.toLowerCase().trim()}`);

  pruneMemoryEvents(now);
  memoryEvents.push({ eventType, ipHash, emailHash, createdAt: now });

  await ensureRateLimitTable();
  const db = getDb();
  if (!db) return;

  try {
    await db.query(
      `INSERT INTO auth_otp_events (event_type, ip_hash, email_hash, created_at) VALUES ($1, $2, $3, $4);`,
      [eventType, ipHash, emailHash, now]
    );
    if (Math.random() < 0.05) {
      await db.query(`DELETE FROM auth_otp_events WHERE created_at < $1;`, [
        now - 48 * 60 * 60 * 1000,
      ]);
    }
  } catch {
    // Fallback memory events already updated
  }
}

export async function checkOtpSendRateLimit(
  ip: string,
  email: string
): Promise<RateLimitDecision> {
  const now = Date.now();
  const ipHash = sha256(`ip:${ip}`);
  const emailHash = sha256(`email:${email.toLowerCase().trim()}`);

  const fifteenMinAgo = now - 15 * 60 * 1000;
  const hourAgo = now - 60 * 60 * 1000;
  const dayAgo = now - 24 * 60 * 60 * 1000;

  let emailLatestAt = 0;
  let emailHourCount = 0;
  let emailDayCount = 0;
  let ip15MinCount = 0;
  let ipHourCount = 0;
  let ipDayCount = 0;
  let globalHourCount = 0;
  let globalDayCount = 0;

  await ensureRateLimitTable();
  const db = getDb();

  if (db) {
    try {
      const res = await db.query(
        `
        SELECT
          MAX(CASE WHEN email_hash = $2 THEN created_at ELSE 0 END) AS email_latest_at,
          COUNT(*) FILTER (WHERE email_hash = $2 AND created_at >= $4) AS email_hour_count,
          COUNT(*) FILTER (WHERE email_hash = $2 AND created_at >= $5) AS email_day_count,
          COUNT(*) FILTER (WHERE ip_hash = $1 AND created_at >= $3) AS ip_15m_count,
          COUNT(*) FILTER (WHERE ip_hash = $1 AND created_at >= $4) AS ip_hour_count,
          COUNT(*) FILTER (WHERE ip_hash = $1 AND created_at >= $5) AS ip_day_count,
          COUNT(*) FILTER (WHERE created_at >= $4) AS global_hour_count,
          COUNT(*) FILTER (WHERE created_at >= $5) AS global_day_count
        FROM auth_otp_events
        WHERE event_type = 'otp_send' AND created_at >= $5;
        `,
        [ipHash, emailHash, fifteenMinAgo, hourAgo, dayAgo]
      );

      const row = res.rows[0];
      if (row) {
        emailLatestAt = Number(row.email_latest_at || 0);
        emailHourCount = Number(row.email_hour_count || 0);
        emailDayCount = Number(row.email_day_count || 0);
        ip15MinCount = Number(row.ip_15m_count || 0);
        ipHourCount = Number(row.ip_hour_count || 0);
        ipDayCount = Number(row.ip_day_count || 0);
        globalHourCount = Number(row.global_hour_count || 0);
        globalDayCount = Number(row.global_day_count || 0);
      }
    } catch {
      // Fall through to in-memory counts below
    }
  }

  pruneMemoryEvents(now);
  for (const ev of memoryEvents) {
    if (ev.eventType !== "otp_send" || ev.createdAt < dayAgo) continue;
    if (ev.emailHash === emailHash && ev.createdAt > emailLatestAt) {
      emailLatestAt = ev.createdAt;
    }
  }

  if (!db) {
    for (const ev of memoryEvents) {
      if (ev.eventType !== "otp_send" || ev.createdAt < dayAgo) continue;
      globalDayCount += 1;
      if (ev.createdAt >= hourAgo) globalHourCount += 1;
      if (ev.ipHash === ipHash) {
        ipDayCount += 1;
        if (ev.createdAt >= hourAgo) ipHourCount += 1;
        if (ev.createdAt >= fifteenMinAgo) ip15MinCount += 1;
      }
      if (ev.emailHash === emailHash) {
        emailDayCount += 1;
        if (ev.createdAt >= hourAgo) emailHourCount += 1;
      }
    }
  }

  if (emailLatestAt > 0 && now - emailLatestAt < OTP_SEND_LIMITS.emailCooldownMs) {
    const retryAfterSeconds = Math.ceil(
      (OTP_SEND_LIMITS.emailCooldownMs - (now - emailLatestAt)) / 1000
    );
    return {
      allowed: false,
      retryAfterSeconds,
      reason: "email_cooldown",
      error: `Please wait ${retryAfterSeconds} seconds before requesting another code.`,
    };
  }

  if (emailHourCount >= OTP_SEND_LIMITS.emailPerHour) {
    return {
      allowed: false,
      retryAfterSeconds: 15 * 60,
      reason: "email_hourly_limit",
      error: "Too many codes requested for this email address. Please wait before trying again or sign in with Google.",
    };
  }

  if (emailDayCount >= OTP_SEND_LIMITS.emailPerDay) {
    return {
      allowed: false,
      retryAfterSeconds: 60 * 60,
      reason: "email_daily_limit",
      error: "Daily verification code limit reached for this email address. Please sign in with Google or try again tomorrow.",
    };
  }

  if (ip15MinCount >= OTP_SEND_LIMITS.ipPer15Min) {
    void notifyAbuseAlert("ip_15m_limit", `ip_hash=${ipHash.slice(0, 12)} count=${ip15MinCount}`);
    return {
      allowed: false,
      retryAfterSeconds: 15 * 60,
      reason: "ip_15m_limit",
      error: "Too many verification requests from your network. Please wait 15 minutes or sign in with Google.",
    };
  }

  if (ipHourCount >= OTP_SEND_LIMITS.ipPerHour) {
    void notifyAbuseAlert("ip_hourly_limit", `ip_hash=${ipHash.slice(0, 12)} count=${ipHourCount}`);
    return {
      allowed: false,
      retryAfterSeconds: 30 * 60,
      reason: "ip_hourly_limit",
      error: "Hourly verification limit reached for your network. Please try again later or sign in with Google.",
    };
  }

  if (ipDayCount >= OTP_SEND_LIMITS.ipPerDay) {
    void notifyAbuseAlert("ip_daily_limit", `ip_hash=${ipHash.slice(0, 12)} count=${ipDayCount}`);
    return {
      allowed: false,
      retryAfterSeconds: 60 * 60,
      reason: "ip_daily_limit",
      error: "Daily verification limit reached for your network. Please sign in with Google.",
    };
  }

  if (globalHourCount >= OTP_SEND_LIMITS.globalPerHour || globalDayCount >= OTP_SEND_LIMITS.globalPerDay) {
    void notifyAbuseAlert(
      "global_circuit_breaker",
      `globalHour=${globalHourCount}/${OTP_SEND_LIMITS.globalPerHour}, globalDay=${globalDayCount}/${OTP_SEND_LIMITS.globalPerDay}`
    );
    return {
      allowed: false,
      retryAfterSeconds: 30 * 60,
      reason: "global_circuit_breaker",
      error: "Email verification is temporarily busy. Please continue with Google Account or try again later.",
    };
  }

  return { allowed: true };
}

export async function checkOtpVerifyRateLimit(ip: string): Promise<RateLimitDecision> {
  const now = Date.now();
  const ipHash = sha256(`ip:${ip}`);
  const fifteenMinAgo = now - 15 * 60 * 1000;
  const hourAgo = now - 60 * 60 * 1000;

  let ip15MinCount = 0;
  let ipHourCount = 0;

  await ensureRateLimitTable();
  const db = getDb();

  if (db) {
    try {
      const res = await db.query(
        `
        SELECT
          COUNT(*) FILTER (WHERE created_at >= $2) AS ip_15m_count,
          COUNT(*) FILTER (WHERE created_at >= $3) AS ip_hour_count
        FROM auth_otp_events
        WHERE event_type = 'otp_verify_fail' AND ip_hash = $1 AND created_at >= $3;
        `,
        [ipHash, fifteenMinAgo, hourAgo]
      );
      const row = res.rows[0];
      if (row) {
        ip15MinCount = Number(row.ip_15m_count || 0);
        ipHourCount = Number(row.ip_hour_count || 0);
      }
    } catch {
      // Fallback to in-memory
    }
  } else {
    pruneMemoryEvents(now);
    for (const ev of memoryEvents) {
      if (ev.eventType !== "otp_verify_fail" || ev.ipHash !== ipHash) continue;
      if (ev.createdAt >= hourAgo) ipHourCount += 1;
      if (ev.createdAt >= fifteenMinAgo) ip15MinCount += 1;
    }
  }

  if (
    ip15MinCount >= OTP_VERIFY_FAIL_LIMITS.ipPer15Min ||
    ipHourCount >= OTP_VERIFY_FAIL_LIMITS.ipPerHour
  ) {
    return {
      allowed: false,
      retryAfterSeconds: 15 * 60,
      reason: "verify_ip_limit",
      error: "Too many failed verification attempts. Please wait 15 minutes before trying again.",
    };
  }

  return { allowed: true };
}
