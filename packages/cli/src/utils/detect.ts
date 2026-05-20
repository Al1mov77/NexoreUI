import * as fs from 'fs';
import * as path from 'path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type ProjectType = 'next' | 'vite' | 'cra' | 'unknown';

export interface ProjectInfo {
  packageManager: PackageManager;
  projectType: ProjectType;
  hasSrcDir: boolean;
  baseDir: string;
}

export function detectProject(cwd: string = process.cwd()): ProjectInfo {
  let packageManager: PackageManager = 'npm';
  let projectType: ProjectType = 'unknown';
  let hasSrcDir = false;

  // Determine base project directory (walk up to find package.json)
  let currentDir = cwd;
  let baseDir = cwd;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      baseDir = currentDir;
      break;
    }
    currentDir = path.dirname(currentDir);
  }

  // Detect Package Manager
  if (fs.existsSync(path.join(baseDir, 'pnpm-lock.yaml'))) {
    packageManager = 'pnpm';
  } else if (fs.existsSync(path.join(baseDir, 'yarn.lock'))) {
    packageManager = 'yarn';
  } else if (fs.existsSync(path.join(baseDir, 'bun.lockb')) || fs.existsSync(path.join(baseDir, 'bun.lock'))) {
    packageManager = 'bun';
  }

  // Detect Source Directory
  if (fs.existsSync(path.join(baseDir, 'src'))) {
    hasSrcDir = true;
  }

  // Detect Project Type (Framework)
  try {
    const packageJsonPath = path.join(baseDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['next']) {
        projectType = 'next';
      } else if (deps['vite'] || deps['@tailwindcss/vite']) {
        projectType = 'vite';
      } else if (deps['react-scripts']) {
        projectType = 'cra';
      }
    }
  } catch (err) {
    // Ignore and fallback to unknown
  }

  return {
    packageManager,
    projectType,
    hasSrcDir,
    baseDir,
  };
}
