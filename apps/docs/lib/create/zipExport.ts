import JSZip from "jszip";
import { getFrameworkConfig, FrameworkType } from "./frameworks";

export interface ZipExportOptions {
  projectName: string;
  framework: FrameworkType;
  selectedComponents: string[] | "all";
  themeColor: string;
  radius: string;
  packageManager: string;
  globalsCssSnippet: string;
  nexoreConfigSnippet: string;
  packageJsonSnippet: string;
  utilsSnippet: string;
  fullCliCommand: string;
  createCommand: string;
}

export async function generateAndDownloadZip(options: ZipExportOptions): Promise<void> {
  const {
    projectName,
    framework,
    selectedComponents,
    themeColor,
    radius,
    packageManager,
    globalsCssSnippet,
    nexoreConfigSnippet,
    packageJsonSnippet,
    utilsSnippet,
    fullCliCommand,
    createCommand,
  } = options;

  const zip = new JSZip();
  const fwConfig = getFrameworkConfig(framework);

  // 1. Fetch real component files from registry API
  try {
    const res = await fetch("/api/registry/bundle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ components: selectedComponents }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.files)) {
        const compFolder = framework === "vite" ? "src/components/ui" : "components/ui";
        for (const file of data.files) {
          zip.file(`${compFolder}/${file.name}`, file.content);
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote component bundle for ZIP, proceeding with project files:", err);
  }

  // 2. Config file
  zip.file("nexore.json", nexoreConfigSnippet);

  // 3. Main CSS file in appropriate path
  zip.file(fwConfig.cssPath, globalsCssSnippet);

  // 4. package.json
  zip.file("package.json", packageJsonSnippet);

  // 5. Utilities file (lib/utils.ts or src/lib/utils.ts)
  const utilsPath = framework === "vite" ? "src/lib/utils.ts" : "lib/utils.ts";
  zip.file(utilsPath, utilsSnippet);

  // 6. .gitignore
  const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# next.js / build output
/.next/
/out/
/dist/
/build/

# debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo
next-env.d.ts

# os
.DS_Store
Thumbs.db
`;
  zip.file(".gitignore", gitignoreContent);

  // 7. Framework-specific project files (tsconfig, next.config/vite.config, layout, page)
  if (framework === "vite") {
    // Vite index.html
    zip.file(
      "index.html",
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} — NexoreUI Starter</title>
  </head>
  <body class="min-h-screen bg-background text-foreground antialiased font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
    );

    // Vite main.tsx
    zip.file(
      "src/main.tsx",
      `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
    );

    // Vite App.tsx
    zip.file(
      "src/App.tsx",
      `import React from "react";
import { Button } from "./components/ui/button";

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-xl w-full p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm text-center">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            NexoreUI Production Starter
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            ${projectName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Vite + React + Tailwind CSS v4 configured with the ${themeColor} palette (${radius}rem radius).
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          <Button>Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>

        <p className="text-xs font-mono text-muted-foreground pt-4 border-t border-border">
          Components are installed in <code>src/components/ui/</code>
        </p>
      </div>
    </main>
  );
}
`
    );

    // Vite vite.config.ts
    zip.file(
      "vite.config.ts",
      `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
`
    );

    // Vite tsconfig.json
    zip.file(
      "tsconfig.json",
      `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
`
    );
  } else {
    // Next.js App Router (or Pages)
    // tsconfig.json
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
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`
    );

    // next.config.mjs
    zip.file(
      "next.config.mjs",
      `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`
    );

    if (framework === "next-pages") {
      // Pages router
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
        "pages/index.tsx",
        `import React from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Head>
        <title>${projectName} — NexoreUI Starter</title>
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 bg-background text-foreground">
        <div className="max-w-xl w-full p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm text-center">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            NexoreUI Production Starter
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            ${projectName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Next.js Pages Router + Tailwind CSS v4 configured with ${themeColor} theme.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </div>
      </main>
    </>
  );
}
`
      );
    } else {
      // App Router (default)
      zip.file(
        "app/layout.tsx",
        `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${projectName} — NexoreUI Starter",
  description: "Production starter configured with NexoreUI and Tailwind CSS v4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
`
      );

      zip.file(
        "app/page.tsx",
        `import React from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 bg-background text-foreground">
      <div className="max-w-xl w-full p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm text-center">
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            NexoreUI Production Starter
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            ${projectName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Next.js App Router + Tailwind CSS v4 configured with the ${themeColor} palette (${radius}rem radius).
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          <Button>Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>

        <div className="pt-4 border-t border-border text-xs font-mono text-muted-foreground space-y-1">
          <p>Installed components: <code>components/ui/</code></p>
          <p>Theme configuration: <code>nexore.json</code></p>
        </div>
      </div>
    </main>
  );
}
`
      );
    }
  }

  // 8. README.md with complete runnable instructions
  const devCmd = packageManager === "npm" ? "npm run dev" : `${packageManager} dev`;
  const installCmd = `${packageManager} install`;

  const readmeContent = `# ${projectName}

Autonomous starter project configured with **NexoreUI** and **Tailwind CSS v4**.

## Quickstart

1. **Install dependencies:**
\`\`\`bash
${installCmd}
\`\`\`

2. **Start development server:**
\`\`\`bash
${devCmd}
\`\`\`

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure
- \`${framework === "vite" ? "src/components/ui/" : "components/ui/"}\` — Installed NexoreUI component source files
- \`${fwConfig.cssPath}\` — Tailwind CSS v4 theme variables
- \`${utilsPath}\` — Styling utility \`cn()\`
- \`nexore.json\` — Theme & framework configuration manifest

## CLI Commands
To add more components to this project:
\`\`\`bash
npx nexoreui add <component-name>
\`\`\`

Or add all available components:
\`\`\`bash
npx nexoreui add --all
\`\`\`
`;

  zip.file("README.md", readmeContent);

  // Generate blob
  const content = await zip.generateAsync({ type: "blob" });

  // Browser download trigger
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
