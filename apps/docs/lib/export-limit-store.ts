import crypto from "crypto";
import { getDb } from "./license-store";

export const DAILY_FREE_EXPORT_LIMIT = 2;
export const EXPORT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface ExportStatus {
  allowed: boolean;
  isPro: boolean;
  totalLimit: number;
  usedToday: number;
  remaining: number;
  resetAt: number | null;
  resetInMs: number;
  serverTime: number;
}

const globalStore = globalThis as unknown as {
  __nexore_exports_memory?: Map<string, number[]>;
};
if (!globalStore.__nexore_exports_memory) {
  globalStore.__nexore_exports_memory = new Map();
}
const memoryExports = globalStore.__nexore_exports_memory;

export async function getUserExportStatus(email: string, isPro: boolean): Promise<ExportStatus> {
  const now = Date.now();
  const cleanEmail = email.toLowerCase().trim();

  if (isPro) {
    return {
      allowed: true,
      isPro: true,
      totalLimit: Infinity,
      usedToday: 0,
      remaining: Infinity,
      resetAt: null,
      resetInMs: 0,
      serverTime: now,
    };
  }

  const cutoff = now - EXPORT_WINDOW_MS;
  const pool = getDb();
  let timestamps: number[] = [];

  if (pool) {
    try {
      await pool.sql`
        CREATE TABLE IF NOT EXISTS free_user_exports (
          id VARCHAR(100) PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          exported_at BIGINT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_free_user_exports_email ON free_user_exports(user_email, exported_at);
      `;

      const res = await pool.query(
        `SELECT exported_at FROM free_user_exports WHERE user_email = $1 AND exported_at > $2 ORDER BY exported_at ASC`,
        [cleanEmail, cutoff]
      );
      timestamps = res.rows.map((r: { exported_at: string | number }) => Number(r.exported_at));
    } catch {
      // Memory fallback
      const list = memoryExports.get(cleanEmail) || [];
      timestamps = list.filter((t) => t > cutoff);
      memoryExports.set(cleanEmail, timestamps);
    }
  } else {
    const list = memoryExports.get(cleanEmail) || [];
    timestamps = list.filter((t) => t > cutoff);
    memoryExports.set(cleanEmail, timestamps);
  }

  const usedToday = timestamps.length;
  const remaining = Math.max(0, DAILY_FREE_EXPORT_LIMIT - usedToday);
  const allowed = remaining > 0;

  let resetAt: number | null = null;
  let resetInMs = 0;

  if (timestamps.length > 0) {
    // Cooldown expires 24 hours after the oldest export in the current rolling window
    const oldest = timestamps[0];
    resetAt = oldest + EXPORT_WINDOW_MS;
    resetInMs = Math.max(0, resetAt - now);
  }

  return {
    allowed,
    isPro: false,
    totalLimit: DAILY_FREE_EXPORT_LIMIT,
    usedToday,
    remaining,
    resetAt,
    resetInMs,
    serverTime: now,
  };
}

export async function recordUserExport(email: string, isPro: boolean): Promise<ExportStatus> {
  const now = Date.now();
  const cleanEmail = email.toLowerCase().trim();

  if (isPro) {
    return {
      allowed: true,
      isPro: true,
      totalLimit: Infinity,
      usedToday: 0,
      remaining: Infinity,
      resetAt: null,
      resetInMs: 0,
      serverTime: now,
    };
  }

  // Pre-check limit
  const current = await getUserExportStatus(cleanEmail, false);
  if (!current.allowed) {
    return current;
  }

  const pool = getDb();
  if (pool) {
    try {
      const id = "exp_" + crypto.randomUUID();
      await pool.query(
        `INSERT INTO free_user_exports (id, user_email, exported_at) VALUES ($1, $2, $3)`,
        [id, cleanEmail, now]
      );
    } catch {
      const list = memoryExports.get(cleanEmail) || [];
      list.push(now);
      memoryExports.set(cleanEmail, list);
    }
  } else {
    const list = memoryExports.get(cleanEmail) || [];
    list.push(now);
    memoryExports.set(cleanEmail, list);
  }

  return getUserExportStatus(cleanEmail, false);
}
