import JSZip from "jszip";
import { getFrameworkConfig, FrameworkType } from "./frameworks";
import {
  AnimationStyleType,
  DefaultModeType,
  DensityType,
  FontFamilyType,
  getPackageManagerRunners,
  PackageManagerType,
  RadiusValue,
  ThemeColor,
} from "./buildCreateCommand";
import {
  buildPackageJson,
  buildStarterWorkspaceTsx,
  getGoogleFontsTags,
  getThemeInitInlineJs,
} from "./starterTemplates";
import { FONT_OPTIONS } from "../../app/context/ThemeCustomizerContext";

export interface ZipExportOptions {
  projectName: string;
  framework: FrameworkType;
  selectedComponents: string[] | "all";
  themeColor: ThemeColor;
  radius: RadiusValue;
  fontFamily: FontFamilyType;
  density: DensityType;
  animationStyle: AnimationStyleType;
  defaultMode: DefaultModeType;
  packageManager: PackageManagerType;
  globalsCssSnippet: string;
  nexoreConfigSnippet: string;
  utilsSnippet: string;
  fullCliCommand: string;
  createCommand: string;
}

interface BundleApiResponse {
  success?: boolean;
  installedIds?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  files?: { id?: string; name: string; content: string }[];
}

export async function generateAndDownloadZip(options: ZipExportOptions): Promise<void> {
  const {
    projectName,
    framework,
    selectedComponents,
    themeColor,
    radius,
    fontFamily,
    density,
    animationStyle,
    defaultMode,
    packageManager,
    globalsCssSnippet,
    nexoreConfigSnippet,
    utilsSnippet,
  } = options;

  const zip = new JSZip();
  const fwConfig = getFrameworkConfig(framework);
  const runners = getPackageManagerRunners(packageManager);
  const fontOpt = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[1];
  const initScript = getThemeInitInlineJs(defaultMode);
  const htmlClass = defaultMode === "dark" ? ' class="dark"' : "";
  const fontTags = getGoogleFontsTags(fontFamily);

  let installedIds: string[] = [];
  let extraDependencies: Record<string, string> = {};
  let extraDevDependencies: Record<string, string> = {};

  try {
    const res = await fetch("/api/registry/bundle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        components: selectedComponents,
        utilsImport: fwConfig.aliases.utils,
      }),
    });

    if (res.ok) {
      const data = (await res.json()) as BundleApiResponse;
      if (Array.isArray(data.files)) {
        for (const file of data.files) {
          zip.file(`${fwConfig.componentsDir}/${file.name}`, file.content);
        }
      }
      if (Array.isArray(data.installedIds)) {
        installedIds = data.installedIds;
      }
      if (data.dependencies && typeof data.dependencies === "object") {
        extraDependencies = data.dependencies;
      }
      if (data.devDependencies && typeof data.devDependencies === "object") {
        extraDevDependencies = data.devDependencies;
      }
    }
  } catch (err) {
    console.warn("Could not fetch component bundle for ZIP, continuing with base files:", err);
  }

  zip.file("nexore.json", nexoreConfigSnippet);
  zip.file(fwConfig.cssPath, globalsCssSnippet);
  zip.file(fwConfig.utilsPath, utilsSnippet);

  const packageJsonContent = buildPackageJson({
    projectName,
    framework,
    extraDependencies,
    extraDevDependencies,
  });
  zip.file("package.json", packageJsonContent);

  zip.file(
    ".gitignore",
    `node_modules
.next
out
dist
build
.astro
.turbo
*.tsbuildinfo
next-env.d.ts
.env
.env*.local
.DS_Store
Thumbs.db
`
  );

  const importPrefix = framework === "remix" ? "~" : "@";
  const starterTsx = buildStarterWorkspaceTsx({
    projectName,
    frameworkLabel: fwConfig.name,
    entryFile: fwConfig.entryFile,
    componentsDir: fwConfig.componentsDir,
    importPrefix,
    themeColor,
    radius,
    fontFamily,
    density,
    animationStyle,
    defaultMode,
    packageManager,
    installedComponents: installedIds,
    includeUseClient: framework === "next-app" || framework === "monorepo",
  });

  if (framework === "vite") {
    zip.file(
      "index.html",
      `<!doctype html>
<html lang="en"${htmlClass} data-density="${density}" data-animation="${animationStyle}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
${fontTags ? fontTags + "\n" : ""}    <script>${initScript}</script>
  </head>
  <body class="min-h-screen bg-background text-foreground antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
    );

    zip.file(
      "src/main.tsx",
      `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`
    );

    zip.file("src/App.tsx", starterTsx);

    zip.file(
      "vite.config.ts",
      `import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
`
    );

    zip.file(
      "tsconfig.json",
      `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`
    );

    zip.file(
      "tsconfig.app.json",
      `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
`
    );

    zip.file(
      "tsconfig.node.json",
      `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
`
    );
  } else if (framework === "astro") {
    zip.file(
      "astro.config.mjs",
      `import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
`
    );

    zip.file(
      "tsconfig.json",
      `{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`
    );

    zip.file(
      "src/pages/index.astro",
      `---
import "../styles/global.css";
import StarterWorkspace from "../components/StarterWorkspace";
---

<!doctype html>
<html lang="en"${htmlClass} data-density="${density}" data-animation="${animationStyle}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
${fontTags ? fontTags + "\n" : ""}    <script is:inline>${initScript}</script>
  </head>
  <body class="min-h-screen bg-background text-foreground antialiased">
    <StarterWorkspace client:load />
  </body>
</html>
`
    );

    zip.file("src/components/StarterWorkspace.tsx", starterTsx);
  } else if (framework === "remix") {
    zip.file(
      "vite.config.ts",
      `import { vitePlugin as remix } from "@remix-run/dev";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), remix(), tsconfigPaths()],
});
`
    );

    zip.file(
      "tsconfig.json",
      `{
  "include": ["**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "target": "ES2022",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
`
    );

    const fontHeadJsx = fontOpt.googleFontsHref
      ? `        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${fontOpt.googleFontsHref}" rel="stylesheet" />
`
      : "";

    zip.file(
      "app/root.tsx",
      `import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import "./tailwind.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"${htmlClass}
      data-density="${density}"
      data-animation="${animationStyle}"
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
${fontHeadJsx}        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(initScript)} }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
`
    );

    zip.file("app/routes/_index.tsx", starterTsx);
  } else if (framework === "monorepo") {
    zip.file(
      "pnpm-workspace.yaml",
      `packages:
  - "apps/*"
  - "packages/*"
`
    );

    zip.file(
      "turbo.json",
      JSON.stringify(
        {
          $schema: "https://turbo.build/schema.json",
          tasks: {
            build: {
              dependsOn: ["^build"],
              outputs: [".next/**", "!.next/cache/**"],
            },
            dev: {
              cache: false,
              persistent: true,
            },
          },
        },
        null,
        2
      )
    );

    zip.file(
      "apps/web/package.json",
      buildPackageJson({
        projectName: `${projectName}-web`,
        framework: "next-app",
        extraDependencies,
        extraDevDependencies,
      })
    );

    zip.file(
      "apps/web/postcss.config.mjs",
      `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`
    );

    zip.file(
      "apps/web/next.config.mjs",
      `const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`
    );

    zip.file(
      "apps/web/tsconfig.json",
      `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`
    );

    const fontHeadJsx = fontOpt.googleFontsHref
      ? `        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${fontOpt.googleFontsHref}" rel="stylesheet" />
`
      : "";

    zip.file(
      "apps/web/app/layout.tsx",
      `import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Application configured with NexoreUI and Tailwind CSS v4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"${htmlClass}
      data-density="${density}"
      data-animation="${animationStyle}"
      suppressHydrationWarning
    >
      <head>
${fontHeadJsx}        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(initScript)} }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
`
    );

    zip.file("apps/web/app/page.tsx", starterTsx);
  } else {
    zip.file(
      "postcss.config.mjs",
      `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`
    );

    zip.file(
      "tsconfig.json",
      `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`
    );

    zip.file(
      "next.config.mjs",
      `const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`
    );

    const fontHeadJsx = fontOpt.googleFontsHref
      ? `        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${fontOpt.googleFontsHref}" rel="stylesheet" />
`
      : "";

    if (framework === "next-pages") {
      zip.file(
        "pages/_app.tsx",
        `import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
`
      );

      zip.file(
        "pages/_document.tsx",
        `import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html
      lang="en"${htmlClass}
      data-density="${density}"
      data-animation="${animationStyle}"
      suppressHydrationWarning
    >
      <Head>
${fontHeadJsx}        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(initScript)} }} />
      </Head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`
      );

      zip.file("pages/index.tsx", starterTsx);
    } else {
      zip.file(
        "app/layout.tsx",
        `import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName}",
  description: "Application configured with NexoreUI and Tailwind CSS v4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"${htmlClass}
      data-density="${density}"
      data-animation="${animationStyle}"
      suppressHydrationWarning
    >
      <head>
${fontHeadJsx}        <script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(initScript)} }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
`
      );

      zip.file("app/page.tsx", starterTsx);
    }
  }

  const readmeContent = `# ${projectName}

Starter project configured with NexoreUI and Tailwind CSS v4.

## Quickstart

1. Install dependencies:
\`\`\`bash
${runners.installCmd}
\`\`\`

2. Start the development server:
\`\`\`bash
${runners.devCmd}
\`\`\`

3. Open http://localhost:${fwConfig.devPort} in your browser.

## Configuration

- Framework: ${fwConfig.name}
- Theme: ${themeColor}
- Radius: ${radius}rem
- Font: ${fontOpt.label}
- Density: ${density}
- Animation: ${animationStyle}
- Default mode: ${defaultMode}
- Installed components (${installedIds.length}): ${installedIds.join(", ") || "none"}

## Project Structure

- \`${fwConfig.componentsDir}/\` - Installed NexoreUI component source files
- \`${fwConfig.cssPath}\` - Tailwind CSS v4 design tokens
- \`${fwConfig.utilsPath}\` - \`cn()\` class name utility
- \`nexore.json\` - Theme and framework configuration

## Add More Components

\`\`\`bash
${runners.addRunner} <component-name>
\`\`\`
`;

  zip.file("README.md", readmeContent);

  const content = await zip.generateAsync({ type: "blob" });
  const safeFileName = `${projectName.toLowerCase().replace(/[^a-z0-9._-]/g, "-")}-nexore-kit.zip`;
  const url = URL.createObjectURL(content);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
