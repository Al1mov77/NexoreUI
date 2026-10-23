const path = require("path");
const crypto = require("crypto");
const { createPool } = require(path.join(__dirname, "../apps/docs/node_modules/@vercel/postgres"));

function generateLicenseKey() {
  const segment1 = crypto.randomBytes(3).toString("hex").toUpperCase();
  const segment2 = crypto.randomBytes(3).toString("hex").toUpperCase();
  const segment3 = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `NEXORE-PRO-${segment1}-${segment2}-${segment3}`;
}

function generateInviteToken() {
  return `inv_${crypto.randomBytes(16).toString("hex")}`;
}

async function grantPro(targetEmail) {
  const email = (targetEmail || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Error: Please provide a valid email address.");
    console.log("Usage: node scripts/grant-pro.js <email>");
    console.log("Example: node scripts/grant-pro.js developer@example.com");
    process.exit(1);
  }

  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error("Error: POSTGRES_URL or DATABASE_URL environment variable is missing.");
    process.exit(1);
  }

  const pool = createPool({ connectionString: url });

  // 1. Ensure tables exist
  await pool.query(`
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
    CREATE TABLE IF NOT EXISTS pro_licenses (
      license_key VARCHAR(100) PRIMARY KEY,
      order_id VARCHAR(100) NOT NULL,
      owner_email VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL,
      tier VARCHAR(50) NOT NULL,
      created_at BIGINT NOT NULL,
      seats_total INT NOT NULL DEFAULT 3,
      seats_used INT NOT NULL DEFAULT 1,
      last_reset_at BIGINT,
      resets_count INT DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS pro_invites (
      token VARCHAR(100) PRIMARY KEY,
      license_key VARCHAR(100) NOT NULL,
      created_at BIGINT NOT NULL,
      status VARCHAR(50) NOT NULL,
      redeemed_by_email VARCHAR(255),
      redeemed_at BIGINT
    );
  `);

  // 2. Check if user already has an active license
  const existing = await pool.query(
    "SELECT * FROM pro_licenses WHERE LOWER(owner_email) = $1 AND status = 'active' LIMIT 1;",
    [email]
  );

  let licenseKey = "";
  let orderId = "";
  const now = Date.now();

  if (existing.rows.length > 0) {
    licenseKey = existing.rows[0].license_key;
    orderId = existing.rows[0].order_id;
    console.log(`\n✔ User ${email} has an active Pro license: ${licenseKey}`);

    const existingInvites = await pool.query(
      "SELECT * FROM pro_invites WHERE license_key = $1;",
      [licenseKey]
    );
    if (existingInvites.rows.length === 0) {
      const inv1 = generateInviteToken();
      const inv2 = generateInviteToken();
      await pool.query(
        `INSERT INTO pro_invites (token, license_key, created_at, status) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8);`,
        [inv1, licenseKey, now, "available", inv2, licenseKey, now, "available"]
      );
      console.log(`+ Generated 2 developer team invite links for ${licenseKey}`);
    }
  } else {
    orderId = `ord_manual_${crypto.randomBytes(8).toString("hex")}`;
    licenseKey = generateLicenseKey();

    // Insert Order
    await pool.query(
      `INSERT INTO pro_orders (order_id, customer_email, amount, currency, status, provider, created_at, paid_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [orderId, email, 0, "USD", "paid", "manual_admin", now, now]
    );

    // Insert License
    await pool.query(
      `INSERT INTO pro_licenses (license_key, order_id, owner_email, status, tier, created_at, seats_total, seats_used)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [licenseKey, orderId, email, "active", "lifetime", now, 3, 1]
    );

    // Insert 2 Team Invites
    const inv1 = generateInviteToken();
    const inv2 = generateInviteToken();
    await pool.query(
      `INSERT INTO pro_invites (token, license_key, created_at, status) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8);`,
      [inv1, licenseKey, now, "available", inv2, licenseKey, now, "available"]
    );

    console.log(`\n✔ Successfully granted Lifetime Pro license to ${email}!`);
  }

  // 3. Fetch Invites
  const invitesRes = await pool.query(
    "SELECT * FROM pro_invites WHERE license_key = $1;",
    [licenseKey]
  );

  console.log("\n============================================================");
  console.log(`  NEXOREUI PRO ACCESS DETAILS`);
  console.log("============================================================");
  console.log(`  Owner:       ${email}`);
  console.log(`  License Key: ${licenseKey}`);
  console.log(`  Tier:        Lifetime Pro (Commercial License)`);
  console.log(`  Seats:       3 (1 Owner + 2 Teammates)`);
  console.log("------------------------------------------------------------");
  console.log(`  CLI Activation:`);
  console.log(`    npx nexoreui auth ${licenseKey}`);
  console.log("------------------------------------------------------------");
  console.log(`  Team Invite Links (Share with colleagues for free Pro):`);
  invitesRes.rows.forEach((inv, i) => {
    const statusNote = inv.status === "redeemed" ? `(Redeemed by ${inv.redeemed_by_email})` : "(Available)";
    console.log(`    Seat ${i + 1}: https://www.nexoreui.site/invite/${inv.token} ${statusNote}`);
  });
  console.log("------------------------------------------------------------");
  console.log(`  Workspace Dashboard:`);
  console.log(`    https://www.nexoreui.site/workspace?key=${licenseKey}`);
  console.log("============================================================\n");

  process.exit(0);
}

const target = process.argv[2];
grantPro(target).catch((err) => {
  console.error("Error granting Pro:", err);
  process.exit(1);
});
