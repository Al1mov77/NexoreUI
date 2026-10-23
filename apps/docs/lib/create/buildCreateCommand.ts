import { FrameworkType, getFrameworkConfig } from "./frameworks";

export type PackageManagerType = "pnpm" | "npm" | "yarn" | "bun";
export type ThemeColor =
  | "indigo"
  | "violet"
  | "emerald"
  | "rose"
  | "amber"
  | "cyan"
  | "sky"
  | "slate"
  | "orange"
  | "neon"
  | "crimson";

export type RadiusValue = "0" | "0.3" | "0.5" | "0.625" | "0.75" | "1.0";
export type FontFamilyType = "inter" | "geist" | "jetbrains" | "system";
export type DensityType = "compact" | "default" | "relaxed";
export type AnimationStyleType = "subtle" | "energetic" | "none";
export type DefaultModeType = "system" | "dark" | "light";

export interface BuildCreateCommandOptions {
  packageManager: PackageManagerType;
  projectName?: string;
  framework: FrameworkType;
  presetId?: string;
  selectedComponents: string[] | "all";
  themeColor: ThemeColor;
  radius: RadiusValue;
  fontFamily: FontFamilyType;
  density: DensityType;
  animationStyle: AnimationStyleType;
  defaultMode: DefaultModeType;
}

export interface BuildCreateCommandResult {
  createCommand: string;
  initCommand: string;
  addCommand: string | null;
  fullCliCommand: string;
  safeProjectName: string;
}

export function sanitizeProjectName(name?: string): string {
  if (!name) return "my-nexore-app";
  const cleaned = name
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned.length > 0 ? cleaned : "my-nexore-app";
}

export function getPackageManagerRunners(pm: PackageManagerType) {
  switch (pm) {
    case "pnpm":
      return {
        createRunner: "pnpm dlx nexoreui",
        initRunner: "pnpm dlx nexoreui init",
        addRunner: "pnpm dlx nexoreui add",
        installPkg: "pnpm add",
      };
    case "bun":
      return {
        createRunner: "bunx nexoreui",
        initRunner: "bunx nexoreui init",
        addRunner: "bunx nexoreui add",
        installPkg: "bun add",
      };
    case "yarn":
      return {
        createRunner: "yarn dlx nexoreui",
        initRunner: "yarn dlx nexoreui init",
        addRunner: "yarn dlx nexoreui add",
        installPkg: "yarn add",
      };
    case "npm":
    default:
      return {
        createRunner: "npx nexoreui",
        initRunner: "npx nexoreui init",
        addRunner: "npx nexoreui add",
        installPkg: "npm install",
      };
  }
}

export function buildCreateCommand(options: BuildCreateCommandOptions): BuildCreateCommandResult {
  const {
    packageManager,
    projectName,
    framework,
    presetId,
    selectedComponents,
    themeColor,
    radius,
    fontFamily,
    density,
    animationStyle,
    defaultMode,
  } = options;

  const safeProjectName = sanitizeProjectName(projectName);
  const runners = getPackageManagerRunners(packageManager);
  const fwConfig = getFrameworkConfig(framework);

  const sharedFlags = `--framework ${fwConfig.cliFlag} --theme ${themeColor} --radius ${radius} --font ${fontFamily} --density ${density} --animation ${animationStyle} --mode ${defaultMode}`;

  const createCommand = `${runners.createRunner} create ${safeProjectName} ${sharedFlags}`;
  const initCommand = `${runners.initRunner} ${sharedFlags}`;

  let addCommand: string | null = null;
  if (presetId === "full" || selectedComponents === "all") {
    addCommand = `${runners.addRunner} --all`;
  } else if (Array.isArray(selectedComponents)) {
    const validComps = selectedComponents.filter((c) => Boolean(c) && c !== "all");
    if (validComps.length > 0) {
      addCommand = `${runners.addRunner} ${validComps.join(" ")}`;
    }
  }

  const fullCliCommand = addCommand ? `${initCommand} && ${addCommand}` : initCommand;

  return {
    createCommand,
    initCommand,
    addCommand,
    fullCliCommand,
    safeProjectName,
  };
}
