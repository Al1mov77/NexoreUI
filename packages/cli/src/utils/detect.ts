import * as fs from 'fs';
import * as path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type ProjectType = 'next' | 'vite' | 'astro' | 'remix' | 'cra' | 'unknown';

export interface ProjectInfo {
  packageManager: PackageManager;
  projectType: ProjectType;
  hasSrcDir: boolean;
  isNextPagesRouter: boolean;
  baseDir: string;
}

export function detectPackageManagerFromEnv(): PackageManager | undefined {
  const userAgent = process.env.npm_config_user_agent || '';
  if (userAgent.startsWith('pnpm/')) return 'pnpm';
  if (userAgent.startsWith('yarn/')) return 'yarn';
  if (userAgent.startsWith('bun/')) return 'bun';
  if (userAgent.startsWith('npm/')) return 'npm';
  return undefined;
}

export function detectProject(cwd: string = process.cwd()): ProjectInfo {
  let packageManager: PackageManager = 'npm';
  let projectType: ProjectType = 'unknown';
  let hasSrcDir = false;
  let isNextPagesRouter = false;

  let currentDir = cwd;
  let baseDir = cwd;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      baseDir = currentDir;
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  if (fs.existsSync(path.join(baseDir, 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  } else if (fs.existsSync(path.join(baseDir, 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (
    fs.existsSync(path.join(baseDir, 'bun.lockb')) ||
    fs.existsSync(path.join(baseDir, 'bun.lock'))
  ) {
    packageManager = 'bun';
  } else {
    packageManager = detectPackageManagerFromEnv() || 'npm';
  }

  if (fs.existsSync(path.join(baseDir, 'src'))) {
    hasSrcDir = true;
  }

  try {
    const packageJsonPath = path.join(baseDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['next']) {
        projectType = 'next';
        const hasAppDir =
          fs.existsSync(path.join(baseDir, 'app')) ||
          fs.existsSync(path.join(baseDir, 'src', 'app'));
        const hasPagesDir =
          fs.existsSync(path.join(baseDir, 'pages')) ||
          fs.existsSync(path.join(baseDir, 'src', 'pages'));
        isNextPagesRouter = hasPagesDir && !hasAppDir;
      } else if (deps['astro']) {
        projectType = 'astro';
      } else if (deps['@remix-run/react'] || deps['@remix-run/node'] || deps['@react-router/dev']) {
        projectType = 'remix';
      } else if (deps['vite'] || deps['@tailwindcss/vite']) {
        projectType = 'vite';
      } else if (deps['react-scripts']) {
        projectType = 'cra';
      }
    }
  } catch {
  }

  return {
    packageManager,
    projectType,
    hasSrcDir,
    isNextPagesRouter,
    baseDir,
  };
}
