import crypto from "crypto";
import { getDb } from "./license-store";

interface StoredOtp {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

const globalStore = globalThis as unknown as {
  __nexore_otp_codes?: Map<string, StoredOtp>;
};

if (!globalStore.__nexore_otp_codes) {
  globalStore.__nexore_otp_codes = new Map();
}

const inMemoryOtp = globalStore.__nexore_otp_codes;

let tableInitialized = false;

async function ensureOtpTable() {
  if (tableInitialized) return;
  const db = getDb();
  if (!db) {
    tableInitialized = true;
    return;
  }

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS auth_otp_codes (
        email VARCHAR(255) PRIMARY KEY,
        code VARCHAR(16) NOT NULL,
        expires_at BIGINT NOT NULL,
        attempts INT NOT NULL DEFAULT 0,
        created_at BIGINT NOT NULL
      );
    `);
    tableInitialized = true;
  } catch (err) {
    tableInitialized = true;
  }
}

export async function createAndSaveOtp(email: string): Promise<{ code: string; cooldownRemaining?: number }> {
  const cleanEmail = email.toLowerCase().trim();
  const now = Date.now();

  const existing = inMemoryOtp.get(cleanEmail);
  if (existing && now - existing.createdAt < 45 * 1000) {
    const cooldownRemaining = Math.ceil((45 * 1000 - (now - existing.createdAt)) / 1000);
    return { code: existing.code, cooldownRemaining };
  }

  // Generate cryptographically secure 6-digit random code
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = now + 15 * 60 * 1000; // 15 minutes

  const record: StoredOtp = {
    email: cleanEmail,
    code,
    expiresAt,
    attempts: 0,
    createdAt: now,
  };

  inMemoryOtp.set(cleanEmail, record);

  try {
    await ensureOtpTable();
    const db = getDb();
    if (db) {
      await db.query(
        `
        INSERT INTO auth_otp_codes (email, code, expires_at, attempts, created_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email)
        DO UPDATE SET code = $2, expires_at = $3, attempts = 0, created_at = $5;
      `,
        [cleanEmail, code, expiresAt, 0, now]
      );
    }
  } catch (err) {
    // Memory store handles it if DB is not available
  }

  return { code };
}

export async function verifyOtp(email: string, code: string): Promise<{ valid: boolean; error?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.trim();
  const now = Date.now();

  await ensureOtpTable();
  const db = getDb();

  let stored: StoredOtp | undefined = inMemoryOtp.get(cleanEmail);

  if (db) {
    try {
      const res = await db.query(
        `SELECT email, code, expires_at, attempts, created_at FROM auth_otp_codes WHERE email = $1;`,
        [cleanEmail]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        stored = {
          email: row.email,
          code: row.code,
          expiresAt: Number(row.expires_at),
          attempts: Number(row.attempts),
          createdAt: Number(row.created_at),
        };
      }
    } catch {
      // fallback to in-memory
    }
  }

  if (!stored) {
    return { valid: false, error: "No verification code requested for this email." };
  }

  if (now > stored.expiresAt) {
    inMemoryOtp.delete(cleanEmail);
    return { valid: false, error: "Verification code has expired. Please request a new one." };
  }

  if (stored.attempts >= 5) {
    inMemoryOtp.delete(cleanEmail);
    return { valid: false, error: "Too many failed attempts. Please request a new code." };
  }

  if (stored.code !== cleanCode) {
    stored.attempts += 1;
    inMemoryOtp.set(cleanEmail, stored);
    if (db) {
      try {
        await db.query(`UPDATE auth_otp_codes SET attempts = attempts + 1 WHERE email = $1;`, [cleanEmail]);
      } catch {}
    }
    return { valid: false, error: "Incorrect verification code. Please check and try again." };
  }

  // Code is verified: consume it
  inMemoryOtp.delete(cleanEmail);
  if (db) {
    try {
      await db.query(`DELETE FROM auth_otp_codes WHERE email = $1;`, [cleanEmail]);
    } catch {}
  }

  return { valid: true };
}
