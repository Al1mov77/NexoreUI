import { VaultAsset } from "../../schema";
import { COCKPIT_VAULT_ASSETS } from "./vault-cockpit";
import { HASH_VAULT_ASSETS_A } from "./vault-hash-a";
import { HASH_VAULT_ASSETS_B } from "./vault-hash-b";
import { HASH_VAULT_ASSETS_C } from "./vault-hash-c";
import { HASH_VAULT_ASSETS_D } from "./vault-hash-d";
import { HERO_VIDEO_VAULT_ASSETS } from "./vault-hero-video";
import { MACRO_MORPH_VAULT_ASSETS } from "./vault-macro-morph";
import { NAMED_VAULT_ASSETS_A } from "./vault-named-a";
import { NAMED_VAULT_ASSETS_B } from "./vault-named-b";
import { ORBIT_VAULT_ASSETS } from "./vault-orbit";
import { RAIN_VAULT_ASSETS_A } from "./vault-rain-a";
import { RAIN_VAULT_ASSETS_B } from "./vault-rain-b";
import { RAIN_VAULT_ASSETS_C } from "./vault-rain-c";

export const AUTO_VAULT_ASSETS: readonly VaultAsset[] = [
  ...HERO_VIDEO_VAULT_ASSETS,
  ...MACRO_MORPH_VAULT_ASSETS,
  ...COCKPIT_VAULT_ASSETS,
  ...ORBIT_VAULT_ASSETS,
  ...RAIN_VAULT_ASSETS_A,
  ...RAIN_VAULT_ASSETS_B,
  ...RAIN_VAULT_ASSETS_C,
  ...NAMED_VAULT_ASSETS_A,
  ...NAMED_VAULT_ASSETS_B,
  ...HASH_VAULT_ASSETS_A,
  ...HASH_VAULT_ASSETS_B,
  ...HASH_VAULT_ASSETS_C,
  ...HASH_VAULT_ASSETS_D,
];

export const AUTO_CLEAN_ASSET_COUNT: number = AUTO_VAULT_ASSETS.filter(
  (a) => !a.contains_logo
).length;

export {
  ENGINEERING_TAG_META,
  AUTO_SUBCATEGORY_PRESETS,
} from "./presets";
export type { SubcategoryDefaultSpec } from "./presets";

export {
  AUTO_ORBIT_PACK,
  AUTO_MORPH_PACK,
  AUTO_COCKPIT_PACK,
  buildBriefOrbitPack,
  buildBriefMorphPack,
  buildBriefCockpitPack,
} from "./packs";
