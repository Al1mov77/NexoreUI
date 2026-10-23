export type FrameworkType = "next-app" | "next-pages" | "vite" | "remix" | "astro" | "monorepo";

export interface FrameworkConfig {
  id: FrameworkType;
  name: string;
  cssPath: string;
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
    rsc: true,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "next dev",
    buildScript: "next build",
    startScript: "next start",
    tag: "Recommended",
    desc: "React Server Components, App Router & Tailwind CSS v4",
    cliFlag: "next",
  },
  "next-pages": {
    id: "next-pages",
    name: "Next.js (Pages Router)",
    cssPath: "styles/globals.css",
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
    rsc: false,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "vite",
    buildScript: "vite build",
    startScript: "vite preview",
    tag: "Fast SPA",
    desc: "Ultra-fast Single Page Application with Tailwind CSS v4",
    cliFlag: "vite",
  },
  remix: {
    id: "remix",
    name: "Remix / RRv7",
    cssPath: "app/tailwind.css",
    rsc: false,
    aliases: {
      components: "~/components/ui",
      utils: "~/lib/utils",
    },
    devScript: "remix dev",
    buildScript: "remix build",
    startScript: "remix-serve ./build/server/index.js",
    tag: "Fullstack",
    desc: "Fullstack React framework with SSR, nested routing and loaders",
    cliFlag: "remix",
  },
  astro: {
    id: "astro",
    name: "Astro",
    cssPath: "src/styles/global.css",
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
    rsc: true,
    aliases: {
      components: "@/components/ui",
      utils: "@/lib/utils",
    },
    devScript: "turbo dev",
    buildScript: "turbo build",
    startScript: "turbo start",
    tag: "Enterprise",
    desc: "pnpm workspaces + shared UI package architecture",
    cliFlag: "turbo",
  },
};

export function getFrameworkConfig(framework: FrameworkType): FrameworkConfig {
  return FRAMEWORK_CONFIGS[framework] || FRAMEWORK_CONFIGS["next-app"];
}
