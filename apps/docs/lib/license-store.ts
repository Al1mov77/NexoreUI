import { createPool } from "@vercel/postgres";
import crypto from "crypto";

export interface ProOrder {
  orderId: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  provider: "platega" | "manual" | "test";
  providerPaymentId?: string;
  createdAt: number;
  paidAt?: number;
}

export interface ProLicense {
  licenseKey: string;
  orderId: string;
  ownerEmail: string;
  status: "active" | "revoked";
  tier: "lifetime";
  createdAt: number;
  seatsTotal: number;
  seatsUsed: number;
  lastResetAt?: number;
  resetsCount?: number;
}

export interface ProTeamInvite {
  token: string;
  licenseKey: string;
  createdAt: number;
  status: "available" | "redeemed" | "revoked";
  redeemedByEmail?: string;
  redeemedAt?: number;
}

export interface ProActivation {
  activationId: string;
  licenseKey: string;
  deviceId: string;
  deviceName: string;
  createdAt: number;
  lastSeenAt: number;
}

export const MAX_DEVICES_PER_LICENSE = 3;
export const DEVICE_RESET_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days cooldown

export interface LicenseWithInvites {
  license: ProLicense;
  invites: ProTeamInvite[];
  activations?: ProActivation[];
  order?: ProOrder;
}

const globalStore = globalThis as unknown as {
  __nexore_orders?: Map<string, ProOrder>;
  __nexore_licenses?: Map<string, ProLicense>;
  __nexore_invites?: Map<string, ProTeamInvite>;
  __nexore_activations?: Map<string, ProActivation>;
};

if (!globalStore.__nexore_orders) globalStore.__nexore_orders = new Map();
if (!globalStore.__nexore_licenses) globalStore.__nexore_licenses = new Map();
if (!globalStore.__nexore_invites) globalStore.__nexore_invites = new Map();
if (!globalStore.__nexore_activations) globalStore.__nexore_activations = new Map();

const inMemoryOrders = globalStore.__nexore_orders;
const inMemoryLicenses = globalStore.__nexore_licenses;
const inMemoryInvites = globalStore.__nexore_invites;
const inMemoryActivations = globalStore.__nexore_activations;

let pool: ReturnType<typeof createPool> | null = null;
let tablesCreated = false;

function resolveDbUrl(): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  const env = process.env;
  return (
    env.POSTGRES_URL ||
    env.DATABASE_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.POSTGRES_URL_NON_POOLING ||
    env.DATABASE_URL_UNPOOLED
  );
}

function getDb() {
  const url = resolveDbUrl();
  if (!url) return null;
  if (!pool) {
    pool = createPool({ connectionString: url });
  }
  return pool;
}

async function ensureTables() {
  if (tablesCreated) return;
  const db = getDb();
  if (!db) return;

  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS pro_orders (
        order_id VARCHAR(100) PRIMARY KEY,
        customer_email VARCHAR(255) NOT NULL,
        amount NUMERIC NOT NULL,
        currency VARCHAR(10) NOT NULL,
        status VARCHAR(50) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        provider_payment_id VARCHAR(255),
        created_at BIGINT NOT NULL,
        paid_at BIGINT
      );
    `;

    await db.sql`
      CREATE TABLE IF NOT EXISTS pro_licenses (
        license_key VARCHAR(100) PRIMARY KEY,
        order_id VARCHAR(100) NOT NULL,
        owner_email VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        tier VARCHAR(50) NOT NULL,
        created_at BIGINT NOT NULL,
        seats_total INTEGER NOT NULL DEFAULT 3,
        seats_used INTEGER NOT NULL DEFAULT 1
      );
    `;

    await db.sql`
      CREATE TABLE IF NOT EXISTS pro_team_invites (
        token VARCHAR(100) PRIMARY KEY,
        license_key VARCHAR(100) NOT NULL,
        created_at BIGINT NOT NULL,
        status VARCHAR(50) NOT NULL,
        redeemed_by_email VARCHAR(255),
        redeemed_at BIGINT
      );
    `;

    await db.sql`
      CREATE TABLE IF NOT EXISTS pro_license_activations (
        activation_id VARCHAR(100) PRIMARY KEY,
        license_key VARCHAR(100) NOT NULL,
        device_id VARCHAR(120) NOT NULL,
        device_name VARCHAR(255) NOT NULL,
        created_at BIGINT NOT NULL,
        last_seen_at BIGINT NOT NULL
      );
    `;

    try {
      await db.sql`ALTER TABLE pro_licenses ADD COLUMN IF NOT EXISTS last_reset_at BIGINT;`;
      await db.sql`ALTER TABLE pro_licenses ADD COLUMN IF NOT EXISTS resets_count INTEGER DEFAULT 0;`;
    } catch {
      // Column may already exist
    }

    tablesCreated = true;
  } catch (err) {
    // Falls back gracefully to memory cache
  }
}

export function generateLicenseKey(): string {
  const part1 = crypto.randomBytes(3).toString("hex").toUpperCase();
  const part2 = crypto.randomBytes(3).toString("hex").toUpperCase();
  const part3 = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `NX-PRO-${part1}-${part2}-${part3}`;
}

export function generateInviteToken(): string {
  return `inv_${crypto.randomBytes(16).toString("hex")}`;
}

export async function createOrder(data: {
  customerEmail: string;
  amount?: number;
  currency?: string;
  provider?: "platega" | "manual" | "test";
}): Promise<ProOrder> {
  const orderId = `ord_${crypto.randomBytes(12).toString("hex")}`;
  const order: ProOrder = {
    orderId,
    customerEmail: data.customerEmail.toLowerCase().trim(),
    amount: data.amount ?? 39,
    currency: data.currency ?? "USD",
    status: "pending",
    provider: data.provider ?? "platega",
    createdAt: Date.now(),
  };

  inMemoryOrders.set(orderId, order);

  const db = getDb();
  if (db) {
    try {
      await ensureTables();
      await db.sql`
        INSERT INTO pro_orders (
          order_id, customer_email, amount, currency, status, provider, created_at
        ) VALUES (
          ${order.orderId}, ${order.customerEmail}, ${order.amount}, ${order.currency}, ${order.status}, ${order.provider}, ${order.createdAt}
        );
      `;
    } catch (e) {
      // Memory fallback active
    }
  }

  return order;
}

export async function fulfillOrder(
  orderId: string,
  providerPaymentId?: string
): Promise<LicenseWithInvites | null> {
  const now = Date.now();
  let order = inMemoryOrders.get(orderId);

  const db = getDb();
  if (db) {
    try {
      await ensureTables();
      const res = await db.sql`SELECT * FROM pro_orders WHERE order_id = ${orderId} LIMIT 1;`;
      if (res.rows.length > 0) {
        const row = res.rows[0];
        order = {
          orderId: row.order_id,
          customerEmail: row.customer_email,
          amount: Number(row.amount),
          currency: row.currency,
          status: row.status as "pending" | "paid" | "failed",
          provider: row.provider as "platega" | "manual" | "test",
          providerPaymentId: row.provider_payment_id,
          createdAt: Number(row.created_at),
          paidAt: row.paid_at ? Number(row.paid_at) : undefined,
        };
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  if (!order) return null;

  order.status = "paid";
  order.paidAt = now;
  if (providerPaymentId) {
    order.providerPaymentId = providerPaymentId;
  }
  inMemoryOrders.set(orderId, order);

  let licenseKey = "";
  for (const lic of inMemoryLicenses.values()) {
    if (lic.orderId === orderId) {
      licenseKey = lic.licenseKey;
      break;
    }
  }

  if (!licenseKey) {
    licenseKey = generateLicenseKey();
  }

  const license: ProLicense = {
    licenseKey,
    orderId,
    ownerEmail: order.customerEmail,
    status: "active",
    tier: "lifetime",
    createdAt: now,
    seatsTotal: 3,
    seatsUsed: 1,
  };
  inMemoryLicenses.set(licenseKey, license);

  const existingInvites: ProTeamInvite[] = [];
  for (const inv of inMemoryInvites.values()) {
    if (inv.licenseKey === licenseKey) {
      existingInvites.push(inv);
    }
  }

  const invites: ProTeamInvite[] = existingInvites.length >= 2 
    ? existingInvites 
    : [
        {
          token: generateInviteToken(),
          licenseKey,
          createdAt: now,
          status: "available",
        },
        {
          token: generateInviteToken(),
          licenseKey,
          createdAt: now,
          status: "available",
        },
      ];

  invites.forEach((inv) => inMemoryInvites.set(inv.token, inv));

  if (db) {
    try {
      await ensureTables();
      await db.sql`
        UPDATE pro_orders 
        SET status = 'paid', paid_at = ${now}, provider_payment_id = ${providerPaymentId || null}
        WHERE order_id = ${orderId};
      `;

      await db.sql`
        INSERT INTO pro_licenses (
          license_key, order_id, owner_email, status, tier, created_at, seats_total, seats_used
        ) VALUES (
          ${license.licenseKey}, ${license.orderId}, ${license.ownerEmail}, ${license.status}, ${license.tier}, ${license.createdAt}, ${license.seatsTotal}, ${license.seatsUsed}
        )
        ON CONFLICT (license_key) DO UPDATE SET status = 'active';
      `;

      for (const inv of invites) {
        await db.sql`
          INSERT INTO pro_team_invites (
            token, license_key, created_at, status
          ) VALUES (
            ${inv.token}, ${inv.licenseKey}, ${inv.createdAt}, ${inv.status}
          )
          ON CONFLICT (token) DO NOTHING;
        `;
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  return { order, license, invites };
}

export async function getLicenseDetailsByOrderId(
  orderId: string
): Promise<LicenseWithInvites | null> {
  const db = getDb();
  let order = inMemoryOrders.get(orderId);
  let license: ProLicense | null = null;
  const invites: ProTeamInvite[] = [];

  for (const lic of inMemoryLicenses.values()) {
    if (lic.orderId === orderId) {
      license = lic;
      break;
    }
  }

  if (license) {
    for (const inv of inMemoryInvites.values()) {
      if (inv.licenseKey === license.licenseKey) {
        invites.push(inv);
      }
    }
  }

  if (db) {
    try {
      await ensureTables();
      if (!order) {
        const ordRes = await db.sql`SELECT * FROM pro_orders WHERE order_id = ${orderId} LIMIT 1;`;
        if (ordRes.rows.length > 0) {
          const row = ordRes.rows[0];
          order = {
            orderId: row.order_id,
            customerEmail: row.customer_email,
            amount: Number(row.amount),
            currency: row.currency,
            status: row.status as "pending" | "paid" | "failed",
            provider: row.provider as "platega" | "manual" | "test",
            providerPaymentId: row.provider_payment_id,
            createdAt: Number(row.created_at),
            paidAt: row.paid_at ? Number(row.paid_at) : undefined,
          };
          inMemoryOrders.set(orderId, order);
        }
      }

      const licRes = await db.sql`SELECT * FROM pro_licenses WHERE order_id = ${orderId} LIMIT 1;`;
      if (licRes.rows.length > 0) {
        const lRow = licRes.rows[0];
        license = {
          licenseKey: lRow.license_key,
          orderId: lRow.order_id,
          ownerEmail: lRow.owner_email,
          status: lRow.status as "active" | "revoked",
          tier: lRow.tier as "lifetime",
          createdAt: Number(lRow.created_at),
          seatsTotal: Number(lRow.seats_total),
          seatsUsed: Number(lRow.seats_used),
        };
        inMemoryLicenses.set(license.licenseKey, license);

        const invRes = await db.sql`SELECT * FROM pro_team_invites WHERE license_key = ${license.licenseKey};`;
        invRes.rows.forEach((iRow: any) => {
          const invItem: ProTeamInvite = {
            token: iRow.token,
            licenseKey: iRow.license_key,
            createdAt: Number(iRow.created_at),
            status: iRow.status as "available" | "redeemed" | "revoked",
            redeemedByEmail: iRow.redeemed_by_email || undefined,
            redeemedAt: iRow.redeemed_at ? Number(iRow.redeemed_at) : undefined,
          };
          invites.push(invItem);
          inMemoryInvites.set(invItem.token, invItem);
        });
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  if (!license) return null;
  return { license, invites, order };
}

export async function getLicenseDetailsByKey(
  licenseKey: string
): Promise<LicenseWithInvites | null> {
  const cleanKey = licenseKey.trim().toUpperCase();
  let license: ProLicense | null = inMemoryLicenses.get(cleanKey) || null;
  const invites: ProTeamInvite[] = [];

  for (const inv of inMemoryInvites.values()) {
    if (inv.licenseKey === cleanKey) {
      invites.push(inv);
    }
  }

  const db = getDb();
  if (db && !license) {
    try {
      await ensureTables();
      const licRes = await db.sql`SELECT * FROM pro_licenses WHERE license_key = ${cleanKey} LIMIT 1;`;
      if (licRes.rows.length > 0) {
        const lRow = licRes.rows[0];
        license = {
          licenseKey: lRow.license_key,
          orderId: lRow.order_id,
          ownerEmail: lRow.owner_email,
          status: lRow.status as "active" | "revoked",
          tier: lRow.tier as "lifetime",
          createdAt: Number(lRow.created_at),
          seatsTotal: Number(lRow.seats_total),
          seatsUsed: Number(lRow.seats_used),
        };
        inMemoryLicenses.set(license.licenseKey, license);

        const invRes = await db.sql`SELECT * FROM pro_team_invites WHERE license_key = ${cleanKey};`;
        invRes.rows.forEach((iRow: any) => {
          const invItem: ProTeamInvite = {
            token: iRow.token,
            licenseKey: iRow.license_key,
            createdAt: Number(iRow.created_at),
            status: iRow.status as "available" | "redeemed" | "revoked",
            redeemedByEmail: iRow.redeemed_by_email || undefined,
            redeemedAt: iRow.redeemed_at ? Number(iRow.redeemed_at) : undefined,
          };
          invites.push(invItem);
          inMemoryInvites.set(invItem.token, invItem);
        });
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  if (!license) return null;
  const activations = await getLicenseActivations(cleanKey);
  return { license, invites, activations };
}

export async function getLicensesByEmail(
  email: string
): Promise<LicenseWithInvites[]> {
  const cleanEmail = email.toLowerCase().trim();
  const results: LicenseWithInvites[] = [];
  const foundKeys = new Set<string>();

  for (const lic of inMemoryLicenses.values()) {
    if (lic.ownerEmail === cleanEmail && !foundKeys.has(lic.licenseKey)) {
      foundKeys.add(lic.licenseKey);
      const invites: ProTeamInvite[] = [];
      for (const inv of inMemoryInvites.values()) {
        if (inv.licenseKey === lic.licenseKey) {
          invites.push(inv);
        }
      }
      const activations = await getLicenseActivations(lic.licenseKey);
      results.push({ license: lic, invites, activations });
    }
  }

  const db = getDb();
  if (db) {
    try {
      await ensureTables();
      const licRes = await db.sql`SELECT * FROM pro_licenses WHERE owner_email = ${cleanEmail};`;
      for (const lRow of licRes.rows) {
        if (!foundKeys.has(lRow.license_key)) {
          foundKeys.add(lRow.license_key);
          const lic: ProLicense = {
            licenseKey: lRow.license_key,
            orderId: lRow.order_id,
            ownerEmail: lRow.owner_email,
            status: lRow.status as "active" | "revoked",
            tier: lRow.tier as "lifetime",
            createdAt: Number(lRow.created_at),
            seatsTotal: Number(lRow.seats_total),
            seatsUsed: Number(lRow.seats_used),
          };
          inMemoryLicenses.set(lic.licenseKey, lic);

          const invRes = await db.sql`SELECT * FROM pro_team_invites WHERE license_key = ${lic.licenseKey};`;
          const invites: ProTeamInvite[] = invRes.rows.map((iRow: any) => ({
            token: iRow.token,
            licenseKey: iRow.license_key,
            createdAt: Number(iRow.created_at),
            status: iRow.status as "available" | "redeemed" | "revoked",
            redeemedByEmail: iRow.redeemed_by_email || undefined,
            redeemedAt: iRow.redeemed_at ? Number(iRow.redeemed_at) : undefined,
          }));

          invites.forEach((i) => inMemoryInvites.set(i.token, i));
          const activations = await getLicenseActivations(lic.licenseKey);
          results.push({ license: lic, invites, activations });
        }
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  return results;
}

export async function redeemInviteToken(
  token: string,
  colleagueEmail: string
): Promise<{ success: boolean; error?: string; license?: ProLicense }> {
  const cleanEmail = colleagueEmail.toLowerCase().trim();
  let invite = inMemoryInvites.get(token);

  const db = getDb();
  if (db && !invite) {
    try {
      await ensureTables();
      const invRes = await db.sql`SELECT * FROM pro_team_invites WHERE token = ${token} LIMIT 1;`;
      if (invRes.rows.length > 0) {
        const row = invRes.rows[0];
        invite = {
          token: row.token,
          licenseKey: row.license_key,
          createdAt: Number(row.created_at),
          status: row.status as "available" | "redeemed" | "revoked",
          redeemedByEmail: row.redeemed_by_email || undefined,
          redeemedAt: row.redeemed_at ? Number(row.redeemed_at) : undefined,
        };
        inMemoryInvites.set(token, invite);
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  if (!invite) {
    return { success: false, error: "Invalid or expired invite token." };
  }

  if (invite.status !== "available") {
    return {
      success: false,
      error: `This invite token was already redeemed by ${invite.redeemedByEmail || "another teammate"}.`,
    };
  }

  const now = Date.now();
  invite.status = "redeemed";
  invite.redeemedByEmail = cleanEmail;
  invite.redeemedAt = now;
  inMemoryInvites.set(token, invite);

  const license = inMemoryLicenses.get(invite.licenseKey);
  if (license) {
    license.seatsUsed = Math.min(license.seatsTotal, license.seatsUsed + 1);
    inMemoryLicenses.set(license.licenseKey, license);
  }

  if (db) {
    try {
      await ensureTables();
      await db.sql`
        UPDATE pro_team_invites 
        SET status = 'redeemed', redeemed_by_email = ${cleanEmail}, redeemed_at = ${now}
        WHERE token = ${token};
      `;

      if (license) {
        await db.sql`
          UPDATE pro_licenses 
          SET seats_used = ${license.seatsUsed}
          WHERE license_key = ${license.licenseKey};
        `;
      }
    } catch (e) {
      // Memory fallback active
    }
  }

  return { success: true, license: license || undefined };
}

export async function getLicenseActivations(licenseKey: string): Promise<ProActivation[]> {
  const cleanKey = licenseKey.trim().toUpperCase();
  const list: ProActivation[] = [];
  const seenIds = new Set<string>();

  for (const act of inMemoryActivations.values()) {
    if (act.licenseKey === cleanKey) {
      seenIds.add(act.activationId);
      list.push(act);
    }
  }

  const db = getDb();
  if (db) {
    try {
      await ensureTables();
      const res = await db.sql`
        SELECT * FROM pro_license_activations 
        WHERE license_key = ${cleanKey}
        ORDER BY last_seen_at DESC;
      `;
      for (const row of res.rows) {
        if (!seenIds.has(row.activation_id)) {
          seenIds.add(row.activation_id);
          const act: ProActivation = {
            activationId: row.activation_id,
            licenseKey: row.license_key,
            deviceId: row.device_id,
            deviceName: row.device_name,
            createdAt: Number(row.created_at),
            lastSeenAt: Number(row.last_seen_at),
          };
          inMemoryActivations.set(act.activationId, act);
          list.push(act);
        }
      }
    } catch {
      // Memory fallback active
    }
  }

  return list;
}

export async function resetLicenseActivations(
  licenseKey: string
): Promise<{ success: boolean; clearedCount: number; error?: string; nextResetAt?: number }> {
  const cleanKey = licenseKey.trim().toUpperCase();
  const details = await getLicenseDetailsByKey(cleanKey);
  if (!details || details.license.status !== "active") {
    return { success: false, clearedCount: 0, error: "License key is invalid or revoked." };
  }

  const license = details.license;
  const now = Date.now();

  // Enforce 14-day cooldown on device resets
  if (license.lastResetAt) {
    const elapsed = now - license.lastResetAt;
    if (elapsed < DEVICE_RESET_COOLDOWN_MS) {
      const remainingMs = DEVICE_RESET_COOLDOWN_MS - elapsed;
      const daysLeft = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      return {
        success: false,
        clearedCount: 0,
        error: `Device reset cooldown active. Next reset available in ${daysLeft} day(s). For emergency manual reset, contact nexoreuiteam@mail.ru.`,
        nextResetAt: license.lastResetAt + DEVICE_RESET_COOLDOWN_MS,
      };
    }
  }

  let cleared = 0;

  for (const [id, act] of Array.from(inMemoryActivations.entries())) {
    if (act.licenseKey === cleanKey) {
      inMemoryActivations.delete(id);
      cleared++;
    }
  }

  license.lastResetAt = now;
  license.resetsCount = (license.resetsCount || 0) + 1;
  inMemoryLicenses.set(cleanKey, license);

  const db = getDb();
  if (db) {
    try {
      await ensureTables();
      const res = await db.sql`
        DELETE FROM pro_license_activations 
        WHERE license_key = ${cleanKey};
      `;
      cleared = Math.max(cleared, res.rowCount || 0);

      await db.sql`
        UPDATE pro_licenses
        SET last_reset_at = ${now}, resets_count = ${license.resetsCount}
        WHERE license_key = ${cleanKey};
      `;
    } catch {
      // Memory fallback active
    }
  }

  return {
    success: true,
    clearedCount: cleared,
    nextResetAt: now + DEVICE_RESET_COOLDOWN_MS,
  };
}

export async function verifyLicense(
  licenseKey: string,
  deviceId?: string,
  deviceName?: string
): Promise<{
  valid: boolean;
  status: string;
  tier?: string;
  owner?: string;
  activationsCount?: number;
  maxDevices?: number;
  error?: string;
}> {
  const details = await getLicenseDetailsByKey(licenseKey);
  if (!details || details.license.status !== "active") {
    return { valid: false, status: "inactive", error: "License key is invalid or revoked." };
  }

  const cleanKey = details.license.licenseKey;

  if (!deviceId) {
    const activations = await getLicenseActivations(cleanKey);
    return {
      valid: true,
      status: "active",
      tier: details.license.tier,
      owner: details.license.ownerEmail,
      activationsCount: activations.length,
      maxDevices: MAX_DEVICES_PER_LICENSE,
    };
  }

  const cleanDeviceId = deviceId.trim();
  const cleanDeviceName = (deviceName || "Developer Machine").trim().slice(0, 100);
  const now = Date.now();

  const activations = await getLicenseActivations(cleanKey);
  const existing = activations.find((a) => a.deviceId === cleanDeviceId);

  if (existing) {
    existing.lastSeenAt = now;
    if (deviceName) existing.deviceName = cleanDeviceName;
    inMemoryActivations.set(existing.activationId, existing);

    const db = getDb();
    if (db) {
      try {
        await ensureTables();
        await db.sql`
          UPDATE pro_license_activations 
          SET last_seen_at = ${now}, device_name = ${cleanDeviceName}
          WHERE activation_id = ${existing.activationId};
        `;
      } catch {
        // Memory fallback active
      }
    }

    return {
      valid: true,
      status: "active",
      tier: details.license.tier,
      owner: details.license.ownerEmail,
      activationsCount: activations.length,
      maxDevices: MAX_DEVICES_PER_LICENSE,
    };
  }

  if (activations.length >= MAX_DEVICES_PER_LICENSE) {
    return {
      valid: false,
      status: "limit_exceeded",
      error: `Device limit reached (${activations.length}/${MAX_DEVICES_PER_LICENSE} active devices). Reset devices at /workspace or contact support.`,
      activationsCount: activations.length,
      maxDevices: MAX_DEVICES_PER_LICENSE,
      owner: details.license.ownerEmail,
    };
  }

  const newAct: ProActivation = {
    activationId: `act_${crypto.randomBytes(8).toString("hex")}`,
    licenseKey: cleanKey,
    deviceId: cleanDeviceId,
    deviceName: cleanDeviceName,
    createdAt: now,
    lastSeenAt: now,
  };

  inMemoryActivations.set(newAct.activationId, newAct);

  const db = getDb();
  if (db) {
    try {
      await ensureTables();
      await db.sql`
        INSERT INTO pro_license_activations (activation_id, license_key, device_id, device_name, created_at, last_seen_at)
        VALUES (${newAct.activationId}, ${newAct.licenseKey}, ${newAct.deviceId}, ${newAct.deviceName}, ${newAct.createdAt}, ${newAct.lastSeenAt});
      `;
    } catch {
      // Memory fallback active
    }
  }

  return {
    valid: true,
    status: "active",
    tier: details.license.tier,
    owner: details.license.ownerEmail,
    activationsCount: activations.length + 1,
    maxDevices: MAX_DEVICES_PER_LICENSE,
  };
}
