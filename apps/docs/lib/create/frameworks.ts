export type FrameworkType = "next-app" | "next-pages" | "vite" | "remix" | "astro" | "monorepo";

export interface FrameworkConfig {
  id: FrameworkType;
  name: string;
  cssPath: string;
  utilsPath: string;
  componentsDir: string;
  entryFile: string;
  devPort: number;
  rsc: boolean;
  aliases: {
    components: string;
    utils: string;
  };
  devScript: string;
  buildScript: string;
  startScript: string;
  tag: string;
  desc: string;
  cliFlag: "next" | "next-pages" | "vite" | "remix" | "astro" | "turbo";
}

export const FRAMEWORK_CONFIGS: Record<FrameworkType, FrameworkConfig> = {
  "next-app": {
    id: "next-app",
    name: "Next.js (App Router)",
    cssPath: "app/globals.css",
    utilsPath: "lib/utils.ts",
    componentsDir: "components/ui",
    entryFile: "app/page.tsx",
    devPort: 3000,
    rsc: true,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "next dev",
    buildScript: "next build",
    startScript: "next start",
    tag: "Recommended",
    desc: "React Server Components, App Router and Tailwind CSS v4",
    cliFlag: "next",
  },
  "next-pages": {
    id: "next-pages",
    name: "Next.js (Pages Router)",
    cssPath: "styles/globals.css",
    utilsPath: "lib/utils.ts",
    componentsDir: "components/ui",
    entryFile: "pages/index.tsx",
    devPort: 3000,
    rsc: false,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "next dev",
    buildScript: "next build",
    startScript: "next start",
    tag: "Legacy",
    desc: "Classic pages router directory structure",
    cliFlag: "next-pages",
  },
  vite: {
    id: "vite",
    name: "Vite (React)",
    cssPath: "src/index.css",
    utilsPath: "src/lib/utils.ts",
    componentsDir: "src/components/ui",
    entryFile: "src/App.tsx",
    devPort: 5173,
    rsc: false,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "vite",
    buildScript: "tsc -b && vite build",
    startScript: "vite preview",
    tag: "Fast SPA",
    desc: "Single Page Application with Vite and Tailwind CSS v4",
    cliFlag: "vite",
  },
  remix: {
    id: "remix",
    name: "Remix / RRv7",
    cssPath: "app/tailwind.css",
    utilsPath: "app/lib/utils.ts",
    componentsDir: "app/components/ui",
    entryFile: "app/routes/_index.tsx",
    devPort: 5173,
    rsc: false,
    aliases: {
      components: "~/components/ui",
      utils: "~/lib/utils",
    },
    devScript: "remix vite:dev",
    buildScript: "remix vite:build",
    startScript: "remix-serve ./build/server/index.js",
    tag: "Fullstack",
    desc: "Fullstack React framework with SSR, nested routing and loaders",
    cliFlag: "remix",
  },
  astro: {
    id: "astro",
    name: "Astro",
    cssPath: "src/styles/global.css",
    utilsPath: "src/lib/utils.ts",
    componentsDir: "src/components/ui",
    entryFile: "src/components/StarterWorkspace.tsx",
    devPort: 4321,
    rsc: false,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "astro dev",
    buildScript: "astro build",
    startScript: "astro preview",
    tag: "Islands",
    desc: "Content-focused site with React Island components",
    cliFlag: "astro",
  },
  monorepo: {
    id: "monorepo",
    name: "Turborepo Monorepo",
    cssPath: "apps/web/app/globals.css",
    utilsPath: "apps/web/lib/utils.ts",
    componentsDir: "apps/web/components/ui",
    entryFile: "apps/web/app/page.tsx",
    devPort: 3000,
    rsc: true,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "turbo dev",
    buildScript: "turbo build",
    startScript: "turbo start",
    tag: "Enterprise",
    desc: "pnpm workspaces with shared UI architecture",
    cliFlag: "turbo",
  },
};

export function getFrameworkConfig(framework: FrameworkType): FrameworkConfig {
  return FRAMEWORK_CONFIGS[framework] || FRAMEWORK_CONFIGS["next-app"];
}
