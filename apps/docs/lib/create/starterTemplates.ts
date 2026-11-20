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
  frameworkTag: string;
  entryFile: string;
  cssPath: string;
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
  const showSearch = installed.length > 5;

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

  const animProp = isNoAnim ? " animate={false}" : "";
  const reactHooks = showSearch ? "useEffect, useMemo, useState" : "useEffect, useState";
  const lucideIcons = [
    "ArrowUpRight",
    "Check",
    "Copy",
    "FileCode2",
    "Moon",
    ...(showSearch ? ["Search"] : []),
    "Sun",
    "Terminal",
  ].join(", ");

  const lines: string[] = [];
  if (options.includeUseClient) {
    lines.push('"use client";');
    lines.push("");
  }

  lines.push(`import { ${reactHooks} } from "react";`);
  lines.push('import { MotionConfig } from "framer-motion";');
  lines.push(`import { ${lucideIcons} } from "lucide-react";`);

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

  const previewableIds: string[] = [];
  if (hasButton) previewableIds.push("button");
  if (hasCard) previewableIds.push("card");
  if (hasInput) previewableIds.push("input");
  if (hasBadge) previewableIds.push("badge");
  if (hasSwitch) previewableIds.push("switch");
  const defaultSelected = previewableIds[0] || installed[0] || "";

  const heroActions = hasButton
    ? `                <div className="flex flex-wrap items-center gap-2.5">
                  <Button${animProp} onClick={() => window.open("https://www.nexoreui.com/docs", "_blank", "noopener,noreferrer")}>
                    <span>Open Documentation</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                  <Button${animProp} variant="outline" onClick={() => handleCopy(ADD_COMMAND, "hero-cmd")}>
                    {copiedKey === "hero-cmd" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Command Copied</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Copy Add Command</span>
                      </>
                    )}
                  </Button>
                </div>`
    : `                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://www.nexoreui.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span>Open Documentation</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(ADD_COMMAND, "hero-cmd")}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"
                  >
                    {copiedKey === "hero-cmd" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Command Copied</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Copy Add Command</span>
                      </>
                    )}
                  </button>
                </div>`;

  const countPill = hasBadge
    ? `<Badge variant="outline" size="sm" className="w-fit font-mono tabular-nums">{INSTALLED_COMPONENTS.length} installed</Badge>`
    : `<span className="inline-flex w-fit items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">{INSTALLED_COMPONENTS.length} installed</span>`;

  const searchInputMarkup = showSearch
    ? hasInput
      ? `                  <div className="border-b border-border p-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input${animProp} value={query} onChange={setQuery} placeholder="Filter components" aria-label="Filter components" className="pl-8 text-xs h-8" />
                    </div>
                  </div>`
      : `                  <div className="border-b border-border p-3">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Filter components"
                        aria-label="Filter components"
                        className="h-8 w-full rounded-md border border-input bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      />
                    </div>
                  </div>`
    : "";

  const previewCases: string[] = [];

  if (hasButton) {
    previewCases.push(`                  {selectedId === "button" && (
                    <div className="w-full max-w-md space-y-4 rounded-lg border border-border bg-background p-6">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Button${animProp} size="sm" onClick={() => setActionStatus("Primary clicked")}>Deploy</Button>
                        <Button${animProp} size="sm" variant="secondary" onClick={() => setActionStatus("Secondary clicked")}>Preview</Button>
                        <Button${animProp} size="sm" variant="outline" onClick={() => setActionStatus("Outline clicked")}>Inspect</Button>
                        <Button${animProp} size="sm" variant="ghost" onClick={() => setActionStatus("Ready")}>Reset</Button>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                        <span>State</span>
                        <span className="text-foreground">{actionStatus}</span>
                      </div>
                    </div>
                  )}`);
  }

  if (hasCard) {
    const cardBadge = hasBadge
      ? `<Badge variant="outline" size="sm">Active</Badge>`
      : `<span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">Active</span>`;
    previewCases.push(`                  {selectedId === "card" && (
                    <Card${animProp} hover="none" className="w-full max-w-sm border-border bg-card shadow-none">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Release v1.0.0</CardTitle>
                          ${cardBadge}
                        </div>
                        <CardDescription className="text-xs">
                          Production build deployed across edge regions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between border-t border-border pt-4 text-xs">
                        <span className="font-mono text-muted-foreground">Build time</span>
                        <span className="font-mono font-medium tabular-nums text-foreground">1.18s</span>
                      </CardContent>
                    </Card>
                  )}`);
  }

  if (hasInput) {
    previewCases.push(`                  {selectedId === "input" && (
                    <div className="w-full max-w-sm space-y-3 rounded-lg border border-border bg-background p-6">
                      <Input${animProp} label="Project slug" value={slugInput} onChange={setSlugInput} placeholder="production-api" description={\`Endpoint: https://\${slugInput || "app"}.example.com\`} />
                    </div>
                  )}`);
  }

  if (hasBadge) {
    previewCases.push(`                  {selectedId === "badge" && (
                    <div className="flex flex-wrap items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-6 py-8 max-w-md w-full">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="success">Healthy</Badge>
                      <Badge variant="warning">Pending</Badge>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                  )}`);
  }

  if (hasSwitch) {
    previewCases.push(`                  {selectedId === "switch" && (
                    <div className="w-full max-w-sm divide-y divide-border rounded-lg border border-border bg-background">
                      <div className="flex items-center justify-between px-4 py-3.5">
                        <div>
                          <p className="text-xs font-medium text-foreground">Dark appearance</p>
                          <p className="text-[11px] text-muted-foreground">Toggle theme mode live</p>
                        </div>
                        <Switch checked={isDark} onCheckedChange={(checked) => applyMode(Boolean(checked))} aria-label="Toggle dark appearance" />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3.5">
                        <div>
                          <p className="text-xs font-medium text-foreground">Compact layout</p>
                          <p className="text-[11px] text-muted-foreground">{compactPreview ? "Tight padding active" : "Default padding active"}</p>
                        </div>
                        <Switch checked={compactPreview} onCheckedChange={(checked) => setCompactPreview(Boolean(checked))} aria-label="Toggle compact layout" />
                      </div>
                    </div>
                  )}`);
  }

  const knownPreviewSetLiteral = previewableIds.map((id) => `"${id}"`).join(", ");
  const fallbackCond =
    previewableIds.length > 0
      ? `selectedId && ![${knownPreviewSetLiteral}].includes(selectedId)`
      : `Boolean(selectedId)`;

  lines.push("");
  lines.push("interface SpecRow {");
  lines.push("  readonly label: string;");
  lines.push("  readonly value: string;");
  lines.push("  readonly swatch?: boolean;");
  lines.push("}");
  lines.push("");
  lines.push("const INSTALLED_COMPONENTS: readonly string[] = [");
  if (installedListLiteral) {
    lines.push(installedListLiteral);
  }
  lines.push("] as const;");
  lines.push("");
  lines.push("const COMPONENT_IMPORTS: Record<string, string> = {");
  lines.push(`  button: 'import { Button } from "${options.importPrefix}/components/ui/button";',`);
  lines.push(
    `  card: 'import { Card, CardHeader, CardTitle, CardContent } from "${options.importPrefix}/components/ui/card";',`
  );
  lines.push(`  input: 'import { Input } from "${options.importPrefix}/components/ui/input";',`);
  lines.push(`  badge: 'import { Badge } from "${options.importPrefix}/components/ui/badge";',`);
  lines.push(`  switch: 'import { Switch } from "${options.importPrefix}/components/ui/switch";',`);
  lines.push("};");
  lines.push("");
  lines.push("const COMPONENT_NOTES: Record<string, string> = {");
  lines.push('  button: "Action trigger with primary, secondary, outline, and ghost variants.",');
  lines.push('  card: "Structured surface container for grouped metadata and actions.",');
  lines.push('  input: "Accessible text field bound to border, ring, and radius tokens.",');
  lines.push('  badge: "Compact status indicator for labels, states, and counts.",');
  lines.push('  switch: "Binary toggle built on Radix Switch with keyboard focus states.",');
  lines.push("};");
  lines.push("");
  lines.push(`const ADD_COMMAND = "${addRunner} dialog table tabs";`);
  lines.push("");
  lines.push("function toImportLine(id: string): string {");
  lines.push('  if (!id) return "";');
  lines.push("  if (COMPONENT_IMPORTS[id]) return COMPONENT_IMPORTS[id];");
  lines.push("  const pascal = id");
  lines.push('    .split("-")');
  lines.push('    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))');
  lines.push('    .join("");');
  lines.push(`  return \`import { \${pascal} } from "${options.importPrefix}/components/ui/\${id}";\`;`);
  lines.push("}");
  lines.push("");
  lines.push("export default function App() {");
  lines.push(`  const [isDark, setIsDark] = useState(${options.defaultMode === "dark" ? "true" : "false"});`);
  lines.push(`  const [selectedId, setSelectedId] = useState<string>("${defaultSelected}");`);
  if (showSearch) {
    lines.push('  const [query, setQuery] = useState("");');
  }
  lines.push("  const [copiedKey, setCopiedKey] = useState<string | null>(null);");
  if (hasInput) {
    lines.push('  const [slugInput, setSlugInput] = useState("production-api");');
  }
  if (hasSwitch) {
    lines.push("  const [compactPreview, setCompactPreview] = useState(false);");
  }
  if (hasButton) {
    lines.push('  const [actionStatus, setActionStatus] = useState("Ready");');
  }
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
  lines.push("  const handleCopy = async (text: string, key: string) => {");
  lines.push("    if (!text) return;");
  lines.push("    try {");
  lines.push("      await navigator.clipboard.writeText(text);");
  lines.push("      setCopiedKey(key);");
  lines.push("      window.setTimeout(() => setCopiedKey(null), 1600);");
  lines.push("    } catch {}");
  lines.push("  };");
  lines.push("");
  if (showSearch) {
    lines.push("  const filteredComponents = useMemo(() => {");
    lines.push("    const q = query.trim().toLowerCase();");
    lines.push("    if (!q) return INSTALLED_COMPONENTS;");
    lines.push("    return INSTALLED_COMPONENTS.filter((id) => id.toLowerCase().includes(q));");
    lines.push("  }, [query]);");
    lines.push("");
  } else {
    lines.push("  const filteredComponents = INSTALLED_COMPONENTS;");
    lines.push("");
  }
  lines.push("  const specs: readonly SpecRow[] = [");
  lines.push(`    { label: "Framework", value: "${options.frameworkLabel}" },`);
  lines.push(`    { label: "Theme", value: \`${options.themeColor} / \${isDark ? "dark" : "light"}\`, swatch: true },`);
  lines.push(`    { label: "Radius", value: "${options.radius}rem" },`);
  lines.push(`    { label: "Typography", value: "${fontOpt.label}" },`);
  lines.push(`    { label: "Density", value: "${options.density}" },`);
  lines.push(`    { label: "Motion", value: "${options.animationStyle}" },`);
  lines.push("  ];");
  lines.push("");
  lines.push("  const activeImport = toImportLine(selectedId);");
  lines.push("  const activeNote = selectedId");
  lines.push(
    `    ? COMPONENT_NOTES[selectedId] || \`Installed component source at ${options.componentsDir}/\${selectedId}.tsx.\``
  );
  lines.push('    : "Install components using the CLI command below.";');
  lines.push("");
  lines.push("  return (");
  lines.push(`    <MotionConfig reducedMotion="${motionReduced}" transition={${motionTransition}}>`);
  lines.push('      <div className="min-h-screen bg-background text-foreground">');
  lines.push('        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-xs">');
  lines.push('          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between border-x border-border px-5 sm:px-8">');
  lines.push('            <div className="flex items-center gap-2.5 min-w-0">');
  lines.push('              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-foreground text-background font-mono text-xs font-semibold">');
  lines.push("                N");
  lines.push("              </span>");
  lines.push(`              <span className="truncate text-sm font-semibold tracking-tight text-foreground">${options.projectName}</span>`);
  lines.push('              <span className="hidden sm:inline text-border">/</span>');
  lines.push(`              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">${options.frameworkTag}</span>`);
  lines.push("            </div>");
  lines.push('            <div className="flex items-center gap-4">');
  lines.push('              <nav className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">');
  lines.push('                <a href="https://www.nexoreui.com/docs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">');
  lines.push("                  <span>Docs</span>");
  lines.push('                  <ArrowUpRight className="h-3 w-3" />');
  lines.push("                </a>");
  lines.push('                <a href="https://www.nexoreui.com/docs/components" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm">');
  lines.push("                  <span>Components</span>");
  lines.push('                  <ArrowUpRight className="h-3 w-3" />');
  lines.push("                </a>");
  lines.push("              </nav>");
  lines.push("              <button");
  lines.push('                type="button"');
  lines.push("                onClick={() => applyMode(!isDark)}");
  lines.push('                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}');
  lines.push('                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer"');
  lines.push("              >");
  lines.push('                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}');
  lines.push('                <span>{isDark ? "Light" : "Dark"}</span>');
  lines.push("              </button>");
  lines.push("            </div>");
  lines.push("          </div>");
  lines.push("        </header>");
  lines.push("");
  lines.push('        <main className="mx-auto max-w-5xl border-x border-border">');
  lines.push('          <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-border">');
  lines.push('            <div className="lg:col-span-7 flex flex-col justify-between gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:border-r border-border">');
  lines.push('              <div className="space-y-4">');
  lines.push('                <h1 className="text-3xl sm:text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-foreground [text-wrap:balance]">');
  lines.push(`                  ${options.projectName}`);
  lines.push("                </h1>");
  lines.push('                <p className="max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">');
  lines.push('                  Tailwind CSS v4 tokens, path aliases, and {INSTALLED_COMPONENTS.length} local UI components are wired and ready. Replace{" "}');
  lines.push(`                  <code className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">${options.entryFile}</code>{" "}`);
  lines.push("                  to start your product.");
  lines.push("                </p>");
  lines.push("              </div>");
  lines.push('              <div className="space-y-5">');
  lines.push(heroActions);
  lines.push('                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">');
  lines.push(`                  <span>Entry: <span className="text-foreground">${options.entryFile}</span></span>`);
  lines.push(`                  <span>Tokens: <span className="text-foreground">${options.cssPath}</span></span>`);
  lines.push('                  <span>Config: <span className="text-foreground">nexore.json</span></span>');
  lines.push("                </div>");
  lines.push("              </div>");
  lines.push("            </div>");
  lines.push("");
  lines.push('            <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 border-border bg-muted/20">');
  lines.push('              <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">');
  lines.push('                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">Configuration</span>');
  lines.push('                <span className="font-mono text-[11px] text-muted-foreground">nexore.json</span>');
  lines.push("              </div>");
  lines.push('              <dl className="divide-y divide-border flex-1">');
  lines.push("                {specs.map((row) => (");
  lines.push('                  <div key={row.label} className="flex items-center justify-between px-5 py-3.5 sm:px-6 text-xs">');
  lines.push('                    <dt className="text-muted-foreground">{row.label}</dt>');
  lines.push('                    <dd className="flex items-center gap-2 font-mono font-medium tabular-nums text-foreground">');
  lines.push('                      {row.swatch && <span className="h-2.5 w-2.5 rounded-full bg-primary border border-border" />}');
  lines.push("                      <span>{row.value}</span>");
  lines.push("                    </dd>");
  lines.push("                  </div>");
  lines.push("                ))}");
  lines.push("              </dl>");
  lines.push('              <div className="flex items-center justify-between border-t border-border px-5 py-3 sm:px-6 text-[11px] font-mono text-muted-foreground">');
  lines.push("                <span>Components installed</span>");
  lines.push('                <span className="text-foreground tabular-nums">{INSTALLED_COMPONENTS.length} files</span>');
  lines.push("              </div>");
  lines.push("            </div>");
  lines.push("          </section>");
  lines.push("");
  lines.push('          <section className="border-b border-border">');
  lines.push('            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border px-5 py-4 sm:px-8">');
  lines.push("              <div>");
  lines.push('                <h2 className="text-sm font-semibold tracking-tight text-foreground">Component Workbench</h2>');
  lines.push('                <p className="text-xs text-muted-foreground">');
  lines.push(`                  Inspect the components generated in <code className="font-mono text-foreground">${options.componentsDir}/</code> and copy their imports.`);
  lines.push("                </p>");
  lines.push("              </div>");
  lines.push(`              ${countPill}`);
  lines.push("            </div>");
  lines.push("");
  lines.push('            <div className="grid grid-cols-1 lg:grid-cols-12">');
  lines.push('              <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-border flex flex-col">');
  if (searchInputMarkup) {
    lines.push(searchInputMarkup);
  }
  lines.push('                <div className="divide-y divide-border flex-1 max-h-[360px] overflow-y-auto">');
  lines.push("                  {filteredComponents.length > 0 ? (");
  lines.push("                    filteredComponents.map((id, index) => {");
  lines.push("                      const isActive = selectedId === id;");
  lines.push("                      return (");
  lines.push("                        <button");
  lines.push("                          key={id}");
  lines.push('                          type="button"');
  lines.push("                          onClick={() => setSelectedId(id)}");
  lines.push('                          className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${isActive ? "bg-muted/60 text-foreground" : "bg-background text-muted-foreground hover:bg-muted/30 hover:text-foreground"}`}');
  lines.push("                        >");
  lines.push('                          <span className="flex items-center gap-3 min-w-0">');
  lines.push('                            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>');
  lines.push('                            <span className="truncate font-mono text-xs font-medium">{id}.tsx</span>');
  lines.push("                          </span>");
  lines.push('                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-primary" : "bg-transparent"}`} />');
  lines.push("                        </button>");
  lines.push("                      );");
  lines.push("                    })");
  lines.push("                  ) : (");
  lines.push('                    <p className="px-5 py-6 text-xs text-muted-foreground">No components match this filter.</p>');
  lines.push("                  )}");
  lines.push("                </div>");
  lines.push("              </aside>");
  lines.push("");
  lines.push('              <div className="lg:col-span-8 flex flex-col">');
  lines.push('                <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3 bg-muted/15">');
  lines.push('                  <div className="flex items-center gap-2 min-w-0">');
  lines.push('                    <FileCode2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />');
  lines.push('                    <span className="truncate font-mono text-xs text-foreground">');
  lines.push(`                      {selectedId ? \`${options.componentsDir}/\${selectedId}.tsx\` : "${options.componentsDir}/"}`);
  lines.push("                    </span>");
  lines.push("                  </div>");
  lines.push("                  {activeImport && (");
  lines.push("                    <button");
  lines.push('                      type="button"');
  lines.push('                      onClick={() => handleCopy(activeImport, "stage-import")}');
  lines.push('                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"');
  lines.push("                    >");
  lines.push('                      {copiedKey === "stage-import" ? (');
  lines.push('                        <><Check className="h-3 w-3" /><span>Copied</span></>');
  lines.push("                      ) : (");
  lines.push('                        <><Copy className="h-3 w-3" /><span>Copy import</span></>');
  lines.push("                      )}");
  lines.push("                    </button>");
  lines.push("                  )}");
  lines.push("                </div>");
  lines.push("");
  lines.push("                <div");
  lines.push('                  className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-[260px]"');
  lines.push("                  style={{");
  lines.push('                    backgroundImage: "radial-gradient(color-mix(in srgb, var(--foreground) 12%, transparent) 1px, transparent 1px)",');
  lines.push('                    backgroundSize: "18px 18px",');
  lines.push("                  }}");
  lines.push("                >");
  for (const pCase of previewCases) {
    lines.push(pCase);
  }
  lines.push(`                  {${fallbackCond} && (`);
  lines.push('                    <div className="w-full max-w-md space-y-4 rounded-lg border border-border bg-background p-6">');
  lines.push('                      <div className="flex items-center justify-between gap-2">');
  lines.push('                        <span className="font-mono text-sm font-semibold text-foreground">{selectedId}.tsx</span>');
  lines.push('                        <span className="rounded-sm border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">Ready</span>');
  lines.push("                      </div>");
  lines.push('                      <p className="text-xs leading-relaxed text-muted-foreground">');
  lines.push(`                        Source installed in <code className="font-mono text-foreground">${options.componentsDir}/{selectedId}.tsx</code>. Import it directly in your pages or view full prop usage in the docs.`);
  lines.push("                      </p>");
  lines.push('                      <div className="pt-1">');
  lines.push("                        <a");
  lines.push("                          href={`https://www.nexoreui.com/docs/components/${selectedId}`}");
  lines.push('                          target="_blank"');
  lines.push('                          rel="noopener noreferrer"');
  lines.push('                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"');
  lines.push("                        >");
  lines.push("                          <span>View component docs</span>");
  lines.push('                          <ArrowUpRight className="h-3.5 w-3.5" />');
  lines.push("                        </a>");
  lines.push("                      </div>");
  lines.push("                    </div>");
  lines.push("                  )}");
  lines.push("                  {!selectedId && (");
  lines.push('                    <div className="w-full max-w-md space-y-2 rounded-lg border border-border bg-background p-6 text-center">');
  lines.push('                      <p className="text-sm font-medium text-foreground">No components installed yet</p>');
  lines.push('                      <p className="font-mono text-xs text-muted-foreground">{ADD_COMMAND}</p>');
  lines.push("                    </div>");
  lines.push("                  )}");
  lines.push("                </div>");
  lines.push("");
  lines.push('                <div className="border-t border-border bg-muted/20 px-5 py-3 space-y-1">');
  lines.push('                  <code className="block overflow-x-auto font-mono text-xs text-foreground whitespace-nowrap">');
  lines.push("                    {activeImport || ADD_COMMAND}");
  lines.push("                  </code>");
  lines.push('                  <p className="text-[11px] text-muted-foreground">{activeNote}</p>');
  lines.push("                </div>");
  lines.push("              </div>");
  lines.push("            </div>");
  lines.push("          </section>");
  lines.push("");
  lines.push('          <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">');
  lines.push('            <div className="px-5 py-6 sm:px-8 space-y-1.5">');
  lines.push('              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">01 / Edit Entry</p>');
  lines.push('              <p className="text-sm font-medium text-foreground">Replace starter view</p>');
  lines.push('              <p className="text-xs leading-relaxed text-muted-foreground">');
  lines.push(`                Open <code className="font-mono text-foreground">${options.entryFile}</code> and build your application layout directly on top of the configured tokens.`);
  lines.push("              </p>");
  lines.push("            </div>");
  lines.push('            <div className="px-5 py-6 sm:px-8 space-y-1.5">');
  lines.push('              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">02 / Expand Registry</p>');
  lines.push('              <p className="text-sm font-medium text-foreground">Add more components</p>');
  lines.push('              <p className="text-xs leading-relaxed text-muted-foreground">');
  lines.push('                Run <code className="font-mono text-foreground">{ADD_COMMAND}</code> to install additional components on demand.');
  lines.push("              </p>");
  lines.push("            </div>");
  lines.push('            <div className="px-5 py-6 sm:px-8 space-y-1.5">');
  lines.push('              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">03 / Customize Tokens</p>');
  lines.push('              <p className="text-sm font-medium text-foreground">Tune colors and spacing</p>');
  lines.push('              <p className="text-xs leading-relaxed text-muted-foreground">');
  lines.push(`                Adjust semantic variables in <code className="font-mono text-foreground">${options.cssPath}</code> for palette, radius, density, and motion.`);
  lines.push("              </p>");
  lines.push("            </div>");
  lines.push("          </section>");
  lines.push("        </main>");
  lines.push("      </div>");
  lines.push("    </MotionConfig>");
  lines.push("  );");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}
