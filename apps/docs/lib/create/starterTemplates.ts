import { FrameworkType, getFrameworkConfig } from "./frameworks";
import {
  AnimationStyleType,
  DefaultModeType,
  DensityType,
  FontFamilyType,
  PackageManagerType,
  RadiusValue,
  ThemeColor,
} from "./buildCreateCommand";
import { FONT_OPTIONS } from "../../app/context/ThemeCustomizerContext";

export interface PackageJsonBuildOptions {
  projectName: string;
  framework: FrameworkType;
  extraDependencies?: Record<string, string>;
  extraDevDependencies?: Record<string, string>;
}

export function buildPackageJson(options: PackageJsonBuildOptions): string {
  const { projectName, framework, extraDependencies = {}, extraDevDependencies = {} } = options;
  const fwConfig = getFrameworkConfig(framework);

  const baseUiDeps: Record<string, string> = {
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.475.0",
    "tailwind-merge": "^2.6.0",
    ...extraDependencies,
  };

  if (framework === "vite") {
    return JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: fwConfig.devScript,
          build: fwConfig.buildScript,
          preview: fwConfig.startScript,
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          ...baseUiDeps,
        },
        devDependencies: {
          "@tailwindcss/vite": "^4.0.0",
          "@types/node": "^22.10.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          "@vitejs/plugin-react": "^4.3.4",
          tailwindcss: "^4.0.0",
          typescript: "^5.7.2",
          vite: "^6.0.7",
          ...extraDevDependencies,
        },
      },
      null,
      2
    );
  }

  if (framework === "astro") {
    return JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: fwConfig.devScript,
          build: fwConfig.buildScript,
          preview: fwConfig.startScript,
        },
        dependencies: {
          "@astrojs/react": "^4.2.0",
          "@tailwindcss/vite": "^4.0.0",
          astro: "^5.2.0",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          tailwindcss: "^4.0.0",
          ...baseUiDeps,
        },
        devDependencies: {
          "@types/node": "^22.10.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          typescript: "^5.7.2",
          ...extraDevDependencies,
        },
      },
      null,
      2
    );
  }

  if (framework === "remix") {
    return JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {
          dev: fwConfig.devScript,
          build: fwConfig.buildScript,
          start: fwConfig.startScript,
        },
        dependencies: {
          "@remix-run/node": "^2.15.3",
          "@remix-run/react": "^2.15.3",
          "@remix-run/serve": "^2.15.3",
          isbot: "^5.1.17",
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          ...baseUiDeps,
        },
        devDependencies: {
          "@remix-run/dev": "^2.15.3",
          "@tailwindcss/vite": "^4.0.0",
          "@types/node": "^22.10.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          tailwindcss: "^4.0.0",
          typescript: "^5.7.2",
          vite: "^6.0.7",
          "vite-tsconfig-paths": "^5.1.4",
          ...extraDevDependencies,
        },
      },
      null,
      2
    );
  }

  if (framework === "monorepo") {
    return JSON.stringify(
      {
        name: projectName,
        version: "0.1.0",
        private: true,
        workspaces: ["apps/*", "packages/*"],
        scripts: {
          dev: fwConfig.devScript,
          build: fwConfig.buildScript,
          start: fwConfig.startScript,
        },
        devDependencies: {
          turbo: "^2.3.3",
          typescript: "^5.7.2",
        },
      },
      null,
      2
    );
  }

  return JSON.stringify(
    {
      name: projectName,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: fwConfig.devScript,
        build: fwConfig.buildScript,
        start: fwConfig.startScript,
      },
      dependencies: {
        next: "^15.1.6",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
        ...baseUiDeps,
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4.0.0",
        "@types/node": "^22.10.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        postcss: "^8.5.1",
        tailwindcss: "^4.0.0",
        typescript: "^5.7.2",
        ...extraDevDependencies,
      },
    },
    null,
    2
  );
}

export function getGoogleFontsTags(fontFamily: FontFamilyType): string {
  const opt = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[1];
  if (!opt.googleFontsHref) return "";
  return [
    '    <link rel="preconnect" href="https://fonts.googleapis.com" />',
    '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
    `    <link href="${opt.googleFontsHref}" rel="stylesheet" />`,
  ].join("\n");
}

export function getThemeInitInlineJs(mode: DefaultModeType): string {
  if (mode === "dark") {
    return `(function(){try{var s=localStorage.getItem('nexore-theme');var d=s?s==='dark':true;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;
  }
  if (mode === "light") {
    return `(function(){try{var s=localStorage.getItem('nexore-theme');var d=s?s==='dark':false;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
  }
  return `(function(){try{var s=localStorage.getItem('nexore-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
}

export interface StarterWorkspaceOptions {
  projectName: string;
  frameworkLabel: string;
  entryFile: string;
  componentsDir: string;
  importPrefix: string;
  themeColor: ThemeColor;
  radius: RadiusValue;
  fontFamily: FontFamilyType;
  density: DensityType;
  animationStyle: AnimationStyleType;
  defaultMode: DefaultModeType;
  packageManager: PackageManagerType;
  installedComponents: string[];
  includeUseClient?: boolean;
}

export function buildStarterWorkspaceTsx(options: StarterWorkspaceOptions): string {
  const installed = Array.from(new Set(options.installedComponents)).sort();
  const hasButton = installed.includes("button");
  const hasCard = installed.includes("card");
  const hasInput = installed.includes("input");
  const hasBadge = installed.includes("badge");
  const hasSwitch = installed.includes("switch");

  const isNoAnim = options.animationStyle === "none";
  const fontOpt = FONT_OPTIONS.find((f) => f.id === options.fontFamily) || FONT_OPTIONS[1];
  const addRunner =
    options.packageManager === "pnpm"
      ? "pnpm dlx nexoreui add"
      : options.packageManager === "bun"
        ? "bunx nexoreui add"
        : options.packageManager === "yarn"
          ? "yarn dlx nexoreui add"
          : "npx nexoreui add";

  const motionReduced = isNoAnim ? "always" : "user";
  const motionTransition =
    options.animationStyle === "energetic"
      ? "{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }"
      : options.animationStyle === "none"
        ? "{ duration: 0 }"
        : "{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }";

  const lines: string[] = [];
  if (options.includeUseClient) {
    lines.push('"use client";');
    lines.push("");
  }

  lines.push('import { useEffect, useMemo, useState } from "react";');
  lines.push('import { MotionConfig } from "framer-motion";');
  lines.push('import { Check, Copy, Moon, Search, Sun } from "lucide-react";');

  if (hasButton) {
    lines.push(`import { Button } from "${options.importPrefix}/components/ui/button";`);
  }
  if (hasCard) {
    lines.push(
      `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "${options.importPrefix}/components/ui/card";`
    );
  }
  if (hasInput) {
    lines.push(`import { Input } from "${options.importPrefix}/components/ui/input";`);
  }
  if (hasBadge) {
    lines.push(`import { Badge } from "${options.importPrefix}/components/ui/badge";`);
  }
  if (hasSwitch) {
    lines.push(`import { Switch } from "${options.importPrefix}/components/ui/switch";`);
  }

  const installedListLiteral = installed.map((id) => `  "${id}"`).join(",\n");
  const animProp = isNoAnim ? " animate={false}" : "";

  const cardOpen = (title: string, desc: string, extra?: string) =>
    hasCard
      ? `<Card hover="none"${animProp} className="rounded-lg border border-border bg-card text-card-foreground shadow-none">
              <CardHeader style={{ padding: "var(--density-padding)" }} className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold tracking-tight">${title}</CardTitle>${extra ? "\n                  " + extra : ""}
                </div>
                <CardDescription className="text-xs text-muted-foreground">${desc}</CardDescription>
              </CardHeader>
              <CardContent style={{ padding: "var(--density-padding)", paddingTop: 0 }} className="space-y-4">`
      : `<section className="rounded-lg border border-border bg-card text-card-foreground">
              <div style={{ padding: "var(--density-padding)" }} className="pb-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">${title}</h2>${extra ? "\n                  " + extra : ""}
                </div>
                <p className="text-xs text-muted-foreground">${desc}</p>
              </div>
              <div style={{ padding: "var(--density-padding)", paddingTop: 0 }} className="space-y-4">`;

  const cardClose = hasCard
    ? `              </CardContent>
            </Card>`
    : `              </div>
            </section>`;

  const countBadge = hasBadge
    ? `<Badge variant="outline" size="sm" className="font-mono tabular-nums">{filtered.length} / {INSTALLED_COMPONENTS.length}</Badge>`
    : `<span className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">{filtered.length} / {INSTALLED_COMPONENTS.length}</span>`;

  const searchField = hasInput
    ? `<div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={setQuery}
                    placeholder="Filter installed components"
                    aria-label="Filter installed components"${animProp}
                    className="pl-8 text-xs"
                  />
                </div>`
    : `<div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Filter installed components"
                    aria-label="Filter installed components"
                    className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                </div>`;

  const buttonsDemo = hasButton
    ? `<div className="grid grid-cols-2 gap-2">
                  <Button size="sm"${animProp} onClick={() => setActiveAction("Primary")}>Primary</Button>
                  <Button size="sm" variant="secondary"${animProp} onClick={() => setActiveAction("Secondary")}>Secondary</Button>
                  <Button size="sm" variant="outline"${animProp} onClick={() => setActiveAction("Outline")}>Outline</Button>
                  <Button size="sm" variant="ghost"${animProp} onClick={() => setActiveAction("Ghost")}>Ghost</Button>
                </div>`
    : `<div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setActiveAction("Primary")} className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Primary</button>
                  <button type="button" onClick={() => setActiveAction("Secondary")} className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Secondary</button>
                  <button type="button" onClick={() => setActiveAction("Outline")} className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Outline</button>
                  <button type="button" onClick={() => setActiveAction("Ghost")} className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Ghost</button>
                </div>`;

  const switchBlock = hasSwitch
    ? `                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium text-foreground">Dark appearance</p>
                    <p className="text-[11px] text-muted-foreground">Switches class on document root</p>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={(checked) => applyMode(Boolean(checked))}
                    aria-label="Toggle dark appearance"
                  />
                </div>`
    : "";

  lines.push("");
  lines.push("interface ConfigSpec {");
  lines.push("  readonly label: string;");
  lines.push("  readonly value: string;");
  lines.push("  readonly swatch?: boolean;");
  lines.push("}");
  lines.push("");
  lines.push("interface TokenRow {");
  lines.push("  readonly name: string;");
  lines.push("  readonly sampleClass: string;");
  lines.push("}");
  lines.push("");
  lines.push("const INSTALLED_COMPONENTS: readonly string[] = [");
  if (installedListLiteral) {
    lines.push(installedListLiteral);
  }
  lines.push("] as const;");
  lines.push("");
  lines.push("const TOKEN_ROWS: readonly TokenRow[] = [");
  lines.push('  { name: "primary", sampleClass: "bg-primary text-primary-foreground" },');
  lines.push('  { name: "secondary", sampleClass: "bg-secondary text-secondary-foreground" },');
  lines.push('  { name: "muted", sampleClass: "bg-muted text-muted-foreground" },');
  lines.push('  { name: "destructive", sampleClass: "bg-destructive text-destructive-foreground" },');
  lines.push("] as const;");
  lines.push("");
  lines.push(`const ADD_COMMAND = "${addRunner} <component>";`);
  lines.push("");
  lines.push("export default function App() {");
  lines.push(`  const [isDark, setIsDark] = useState(${options.defaultMode === "dark" ? "true" : "false"});`);
  lines.push('  const [query, setQuery] = useState("");');
  lines.push("  const [copied, setCopied] = useState(false);");
  lines.push('  const [activeAction, setActiveAction] = useState("Primary");');
  lines.push("");
  lines.push("  useEffect(() => {");
  lines.push('    setIsDark(document.documentElement.classList.contains("dark"));');
  lines.push("  }, []);");
  lines.push("");
  lines.push("  const applyMode = (nextDark: boolean) => {");
  lines.push("    setIsDark(nextDark);");
  lines.push('    document.documentElement.classList.toggle("dark", nextDark);');
  lines.push("    try {");
  lines.push('      localStorage.setItem("nexore-theme", nextDark ? "dark" : "light");');
  lines.push("    } catch {}");
  lines.push("  };");
  lines.push("");
  lines.push("  const handleCopyCommand = async () => {");
  lines.push("    try {");
  lines.push("      await navigator.clipboard.writeText(ADD_COMMAND);");
  lines.push("      setCopied(true);");
  lines.push("      window.setTimeout(() => setCopied(false), 1800);");
  lines.push("    } catch {}");
  lines.push("  };");
  lines.push("");
  lines.push("  const filtered = useMemo(() => {");
  lines.push("    const q = query.trim().toLowerCase();");
  lines.push("    if (!q) return INSTALLED_COMPONENTS;");
  lines.push("    return INSTALLED_COMPONENTS.filter((item) => item.toLowerCase().includes(q));");
  lines.push("  }, [query]);");
  lines.push("");
  lines.push("  const specs: readonly ConfigSpec[] = [");
  lines.push(`    { label: "Theme", value: "${options.themeColor}", swatch: true },`);
  lines.push(`    { label: "Radius", value: "${options.radius}rem" },`);
  lines.push(`    { label: "Font", value: "${fontOpt.label}" },`);
  lines.push(`    { label: "Density", value: "${options.density}" },`);
  lines.push(`    { label: "Motion", value: "${options.animationStyle}" },`);
  lines.push('    { label: "Mode", value: isDark ? "dark" : "light" },');
  lines.push("  ];");
  lines.push("");
  lines.push("  return (");
  lines.push(`    <MotionConfig reducedMotion="${motionReduced}" transition={${motionTransition}}>`);
  lines.push('      <div className="min-h-screen bg-background text-foreground">');
  lines.push('        <header className="h-14 border-b border-border bg-background">');
  lines.push('          <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-5">');
  lines.push('            <div className="flex items-center gap-3 min-w-0">');
  lines.push(`              <span className="truncate text-sm font-semibold tracking-tight text-foreground">${options.projectName}</span>`);
  lines.push(`              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-muted-foreground">${options.frameworkLabel}</span>`);
  lines.push("            </div>");
  lines.push('            <div className="flex items-center gap-3">');
  lines.push("              <a");
  lines.push('                href="https://www.nexoreui.com/docs"');
  lines.push('                target="_blank"');
  lines.push('                rel="noopener noreferrer"');
  lines.push('                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm px-1.5 py-1"');
  lines.push("              >");
  lines.push("                Docs");
  lines.push("              </a>");
  lines.push("              <button");
  lines.push('                type="button"');
  lines.push("                onClick={() => applyMode(!isDark)}");
  lines.push('                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}');
  lines.push('                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"');
  lines.push("              >");
  lines.push('                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}');
  lines.push("              </button>");
  lines.push("            </div>");
  lines.push("          </div>");
  lines.push("        </header>");
  lines.push("");
  lines.push('        <main className="mx-auto max-w-5xl px-5 py-10 sm:py-12">');
  lines.push('          <div className="flex flex-col" style={{ gap: "var(--density-gap)" }}>');
  lines.push('            <div className="space-y-1.5 pb-2">');
  lines.push('              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.035em] text-foreground [text-wrap:balance]">');
  lines.push(`                ${options.projectName}`);
  lines.push("              </h1>");
  lines.push('              <p className="text-sm text-muted-foreground max-w-xl">');
  lines.push('                Start editing{" "}');
  lines.push(`                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">${options.entryFile}</code>{" "}`);
  lines.push('                or adjust theme tokens in{" "}');
  lines.push('                <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">nexore.json</code>.');
  lines.push("              </p>");
  lines.push("            </div>");
  lines.push("");
  lines.push("            <section");
  lines.push('              aria-label="Project configuration"');
  lines.push('              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"');
  lines.push('              style={{ gap: "var(--density-gap)" }}');
  lines.push("            >");
  lines.push("              {specs.map((spec) => (");
  lines.push("                <div");
  lines.push("                  key={spec.label}");
  lines.push('                  className="rounded-lg border border-border bg-card"');
  lines.push('                  style={{ padding: "var(--density-padding)" }}');
  lines.push("                >");
  lines.push('                  <div className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground">');
  lines.push("                    {spec.label}");
  lines.push("                  </div>");
  lines.push('                  <div className="mt-1.5 flex items-center gap-2 text-sm font-medium tabular-nums text-foreground">');
  lines.push("                    {spec.swatch && (");
  lines.push('                      <span className="h-3 w-3 shrink-0 rounded-sm bg-primary border border-border" />');
  lines.push("                    )}");
  lines.push('                    <span className="truncate">{spec.value}</span>');
  lines.push("                  </div>");
  lines.push("                </div>");
  lines.push("              ))}");
  lines.push("            </section>");
  lines.push("");
  lines.push("            <div");
  lines.push('              className="grid grid-cols-1 lg:grid-cols-12 items-start"');
  lines.push('              style={{ gap: "var(--density-gap)" }}');
  lines.push("            >");
  lines.push('              <div className="lg:col-span-7">');
  lines.push(`                ${cardOpen("Installed components", `Files generated in ${options.componentsDir}/`, countBadge)}`);
  lines.push(`                ${searchField}`);
  lines.push("                {filtered.length > 0 ? (");
  lines.push('                  <ul className="grid max-h-64 grid-cols-1 sm:grid-cols-2 gap-1.5 overflow-y-auto pr-1">');
  lines.push("                    {filtered.map((item) => (");
  lines.push("                      <li");
  lines.push("                        key={item}");
  lines.push('                        className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground"');
  lines.push("                      >");
  lines.push('                        <span className="truncate">{item}</span>');
  lines.push('                        <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">.tsx</span>');
  lines.push("                      </li>");
  lines.push("                    ))}");
  lines.push("                  </ul>");
  lines.push("                ) : (");
  lines.push('                  <p className="rounded-md border border-border bg-muted/40 px-3 py-4 text-xs text-muted-foreground">');
  lines.push("                    No installed components match this filter.");
  lines.push("                  </p>");
  lines.push("                )}");
  lines.push('                <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2">');
  lines.push('                  <code className="truncate font-mono text-xs text-foreground">{ADD_COMMAND}</code>');
  lines.push("                  <button");
  lines.push('                    type="button"');
  lines.push("                    onClick={handleCopyCommand}");
  lines.push('                    className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"');
  lines.push("                  >");
  lines.push('                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}');
  lines.push('                    <span>{copied ? "Copied" : "Copy"}</span>');
  lines.push("                  </button>");
  lines.push("                </div>");
  lines.push(`${cardClose}`);
  lines.push("              </div>");
  lines.push("");
  lines.push('              <div className="lg:col-span-5">');
  lines.push(`                ${cardOpen("Tokens and controls", "Verify contrast and component styling in light and dark mode")}`);
  lines.push(`                ${buttonsDemo}`);
  lines.push('                <div className="flex items-center justify-between border-t border-border pt-3 text-xs">');
  lines.push('                  <span className="text-muted-foreground">Selected variant</span>');
  lines.push('                  <span className="font-mono text-foreground">{activeAction}</span>');
  lines.push("                </div>");
  if (switchBlock) {
    lines.push(switchBlock);
  }
  lines.push('                <div className="grid grid-cols-2 gap-2 pt-1">');
  lines.push("                  {TOKEN_ROWS.map((token) => (");
  lines.push("                    <div");
  lines.push("                      key={token.name}");
  lines.push('                      className={`rounded-md px-2.5 py-2 font-mono text-[11px] font-medium ${token.sampleClass}`}');
  lines.push("                    >");
  lines.push("                      --{token.name}");
  lines.push("                    </div>");
  lines.push("                  ))}");
  lines.push("                </div>");
  lines.push(`${cardClose}`);
  lines.push("              </div>");
  lines.push("            </div>");
  lines.push("          </div>");
  lines.push("        </main>");
  lines.push("      </div>");
  lines.push("    </MotionConfig>");
  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}
