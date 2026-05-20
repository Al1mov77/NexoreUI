import * as fs from 'fs';
import * as path from 'path';

const CN_TEMPLATE = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

/**
 * Ensures a directory exists.
 */
export function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Normalizes relative path for imports (using forward slashes, stripping extension).
 */
export function getRelativeImportPath(fromDir: string, toFile: string): string {
  let relativePath = path.relative(fromDir, toFile);
  
  // Replace Windows backslashes with forward slashes
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Remove file extension
  relativePath = relativePath.replace(/\.(ts|tsx|js|jsx)$/, '');
  
  // Ensure it starts with "./" or "../"
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  return relativePath;
}

/**
 * Checks if cn utility exists, writes it if it doesn't.
 */
export function ensureCnUtil(utilsPath: string): boolean {
  const dir = path.dirname(utilsPath);
  ensureDir(dir);
  
  if (!fs.existsSync(utilsPath)) {
    fs.writeFileSync(utilsPath, CN_TEMPLATE, 'utf8');
    return true;
  }
  return false;
}

/**
 * Copies a component template file to target directory, rewriting its cn import.
 */
export function copyComponentFile(
  content: string,
  targetFilePath: string,
  utilsFilePath: string
) {
  const targetDir = path.dirname(targetFilePath);
  ensureDir(targetDir);
  
  // Compute relative path from target component to utils
  const relativeImport = getRelativeImportPath(targetDir, utilsFilePath);
  
  // Rewrite the import path in the template code
  // Handles import { cn } from "../utils/cn" or import { cn } from '../utils/cn'
  const rewrittenContent = content.replace(
    /['"]\.\.\/utils\/cn['"]/g,
    `"${relativeImport}"`
  );
  
  fs.writeFileSync(targetFilePath, rewrittenContent, 'utf8');
}
