import crypto from "crypto";
import { getDb } from "../license-store";
import {
  FORGE_AUTOMOTIVE_ASSETS,
  FORGE_SUBCATEGORIES,
  ForgeBuildRecord,
  ForgeRigSelection,
  ForgeSubcategoryId,
  ForgeSynthesizedCopy,
  ForgeUserInputs,
  compileForgeBuildTsx,
} from "./automotive-manifest";

const globalForgeStore = globalThis as unknown as {
  __nexore_forge_builds?: Map<string, ForgeBuildRecord>;
  __nexore_forge_tables_ready?: boolean;
};

if (!globalForgeStore.__nexore_forge_builds) {
  globalForgeStore.__nexore_forge_builds = new Map<string, ForgeBuildRecord>();
}

const memoryBuilds = globalForgeStore.__nexore_forge_builds;

export async function ensureForgeTables(): Promise<boolean> {
  if (globalForgeStore.__nexore_forge_tables_ready) {
    return true;
  }
  const pool = getDb();
  if (!pool) {
    return false;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forge_assets (
        asset_id VARCHAR(120) PRIMARY KEY,
        vertical_id VARCHAR(80) NOT NULL,
        file_name VARCHAR(160) NOT NULL,
        rig_group VARCHAR(60) NOT NULL,
        chassis_series VARCHAR(80) NOT NULL,
        subcategories JSONB NOT NULL,
        angle_deg INTEGER,
        state_key VARCHAR(60),
        default_title VARCHAR(200) NOT NULL,
        default_metric VARCHAR(120) NOT NULL,
        default_detail TEXT NOT NULL,
        active_in_orbit BOOLEAN DEFAULT TRUE,
        updated_at BIGINT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forge_builds (
        build_id VARCHAR(100) PRIMARY KEY,
        vertical_id VARCHAR(80) NOT NULL,
        subcategory_id VARCHAR(80) NOT NULL,
        brand_name VARCHAR(120) NOT NULL,
        model_name VARCHAR(120) NOT NULL,
        inputs_json JSONB NOT NULL,
        rigs_json JSONB NOT NULL,
        synthesized_json JSONB NOT NULL,
        compiled_tsx TEXT NOT NULL,
        owner_email VARCHAR(255),
        created_at BIGINT NOT NULL
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_forge_builds_created_at
      ON forge_builds (created_at DESC);
    `);

    const now = Date.now();
    for (const asset of FORGE_AUTOMOTIVE_ASSETS) {
      await pool.query(
        `INSERT INTO forge_assets (
          asset_id, vertical_id, file_name, rig_group, chassis_series,
          subcategories, angle_deg, state_key, default_title, default_metric,
          default_detail, active_in_orbit, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (asset_id) DO UPDATE SET
          file_name = EXCLUDED.file_name,
          rig_group = EXCLUDED.rig_group,
          chassis_series = EXCLUDED.chassis_series,
          subcategories = EXCLUDED.subcategories,
          angle_deg = EXCLUDED.angle_deg,
          state_key = EXCLUDED.state_key,
          default_title = EXCLUDED.default_title,
          default_metric = EXCLUDED.default_metric,
          default_detail = EXCLUDED.default_detail,
          active_in_orbit = EXCLUDED.active_in_orbit,
          updated_at = EXCLUDED.updated_at`,
        [
          asset.id,
          "automotive",
          asset.fileName,
          asset.rigGroup,
          asset.chassisSeries,
          JSON.stringify(asset.subcategories),
          asset.angleDeg ?? null,
          asset.stateKey ?? null,
          asset.defaultTitle,
          asset.defaultMetric,
          asset.defaultDetail,
          asset.activeInOrbit ?? true,
          now,
        ]
      );
    }

    globalForgeStore.__nexore_forge_tables_ready = true;
    return true;
  } catch {
    return false;
  }
}

export async function saveForgeBuild(params: {
  subcategoryId: ForgeSubcategoryId;
  inputs: ForgeUserInputs;
  rigs: ForgeRigSelection;
  synthesized: ForgeSynthesizedCopy;
  ownerEmail: string | null;
}): Promise<{ build: ForgeBuildRecord; storedInNeon: boolean }> {
  const buildId = `frg_${crypto.randomBytes(6).toString("hex")}`;
  const createdAt = Date.now();

  const build: ForgeBuildRecord = {
    buildId,
    verticalId: "automotive",
    subcategoryId: params.subcategoryId,
    inputs: params.inputs,
    rigs: params.rigs,
    synthesized: params.synthesized,
    ownerEmail: params.ownerEmail,
    createdAt,
  };

  memoryBuilds.set(buildId, build);

  const pool = getDb();
  if (!pool) {
    return { build, storedInNeon: false };
  }

  try {
    await ensureForgeTables();
    const compiledTsx = compileForgeBuildTsx(build);
    await pool.query(
      `INSERT INTO forge_builds (
        build_id, vertical_id, subcategory_id, brand_name, model_name,
        inputs_json, rigs_json, synthesized_json, compiled_tsx, owner_email, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        build.buildId,
        build.verticalId,
        build.subcategoryId,
        build.inputs.brandName,
        build.inputs.modelName,
        JSON.stringify(build.inputs),
        JSON.stringify(build.rigs),
        JSON.stringify(build.synthesized),
        compiledTsx,
        build.ownerEmail,
        build.createdAt,
      ]
    );
    return { build, storedInNeon: true };
  } catch {
    return { build, storedInNeon: false };
  }
}

export async function getForgeBuildById(
  buildId: string
): Promise<ForgeBuildRecord | null> {
  const cached = memoryBuilds.get(buildId);
  if (cached) {
    return cached;
  }

  const pool = getDb();
  if (!pool) {
    return null;
  }

  try {
    await ensureForgeTables();
    const res = await pool.query(
      `SELECT build_id, vertical_id, subcategory_id, inputs_json, rigs_json, synthesized_json, owner_email, created_at
       FROM forge_builds
       WHERE build_id = $1
       LIMIT 1`,
      [buildId]
    );
    if (!res.rows || res.rows.length === 0) {
      return null;
    }
    const row = res.rows[0] as {
      build_id: string;
      vertical_id: string;
      subcategory_id: ForgeSubcategoryId;
      inputs_json: ForgeUserInputs | string;
      rigs_json: ForgeRigSelection | string;
      synthesized_json: ForgeSynthesizedCopy | string;
      owner_email: string | null;
      created_at: string | number;
    };
    const record: ForgeBuildRecord = {
      buildId: row.build_id,
      verticalId: row.vertical_id,
      subcategoryId: row.subcategory_id,
      inputs:
        typeof row.inputs_json === "string"
          ? (JSON.parse(row.inputs_json) as ForgeUserInputs)
          : row.inputs_json,
      rigs:
        typeof row.rigs_json === "string"
          ? (JSON.parse(row.rigs_json) as ForgeRigSelection)
          : row.rigs_json,
      synthesized:
        typeof row.synthesized_json === "string"
          ? (JSON.parse(row.synthesized_json) as ForgeSynthesizedCopy)
          : row.synthesized_json,
      ownerEmail: row.owner_email,
      createdAt: Number(row.created_at),
    };
    memoryBuilds.set(record.buildId, record);
    return record;
  } catch {
    return null;
  }
}

export async function listRecentForgeBuilds(
  limit = 8
): Promise<{ builds: ForgeBuildRecord[]; neonConnected: boolean; assetCount: number; subcategoryCount: number }> {
  const pool = getDb();
  if (!pool) {
    const localList = Array.from(memoryBuilds.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
    return {
      builds: localList,
      neonConnected: false,
      assetCount: FORGE_AUTOMOTIVE_ASSETS.length,
      subcategoryCount: FORGE_SUBCATEGORIES.length,
    };
  }

  try {
    await ensureForgeTables();
    const res = await pool.query(
      `SELECT build_id, vertical_id, subcategory_id, inputs_json, rigs_json, synthesized_json, owner_email, created_at
       FROM forge_builds
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    const builds: ForgeBuildRecord[] = (res.rows || []).map(
      (row: {
        build_id: string;
        vertical_id: string;
        subcategory_id: ForgeSubcategoryId;
        inputs_json: ForgeUserInputs | string;
        rigs_json: ForgeRigSelection | string;
        synthesized_json: ForgeSynthesizedCopy | string;
        owner_email: string | null;
        created_at: string | number;
      }) => ({
        buildId: row.build_id,
        verticalId: row.vertical_id,
        subcategoryId: row.subcategory_id,
        inputs:
          typeof row.inputs_json === "string"
            ? (JSON.parse(row.inputs_json) as ForgeUserInputs)
            : row.inputs_json,
        rigs:
          typeof row.rigs_json === "string"
            ? (JSON.parse(row.rigs_json) as ForgeRigSelection)
            : row.rigs_json,
        synthesized:
          typeof row.synthesized_json === "string"
            ? (JSON.parse(row.synthesized_json) as ForgeSynthesizedCopy)
            : row.synthesized_json,
        ownerEmail: row.owner_email,
        createdAt: Number(row.created_at),
      })
    );
    return {
      builds,
      neonConnected: true,
      assetCount: FORGE_AUTOMOTIVE_ASSETS.length,
      subcategoryCount: FORGE_SUBCATEGORIES.length,
    };
  } catch {
    const localList = Array.from(memoryBuilds.values())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
    return {
      builds: localList,
      neonConnected: false,
      assetCount: FORGE_AUTOMOTIVE_ASSETS.length,
      subcategoryCount: FORGE_SUBCATEGORIES.length,
    };
  }
}
