import * as fs from 'fs';
import * as path from 'path';

interface ReplacementRecord {
  rule: string;
  before: string;
  after: string;
  line: number;
}

interface FileReport {
  filePath: string;
  relativeFilePath: string;
  replacements: ReplacementRecord[];
  gradientReviews: { line: number; text: string }[];
  manualReviews: { line: number; text: string; reason: string }[];
}

interface CodemodSummary {
  mode: 'dry-run' | 'write';
  scannedFilesCount: number;
  modifiedFilesCount: number;
  totalReplacements: number;
  replacementsByRule: Record<string, number>;
  modifiedFiles: string[];
  gradientReviewFiles: { file: string; line: number; snippet: string }[];
  manualReviewItems: { file: string; line: number; reason: string; snippet: string }[];
}

const CHROMATIC_COLORS = [
  'cyan',
  'sky',
  'teal',
  'violet',
  'purple',
  'indigo',
  'fuchsia',
  'pink',
];

const CHROMATIC_HEX_REGEX =
  /#(06b6d4|22d3ee|38bdf8|0ea5e9|0284c7|8b5cf6|a855f7|7c3aed|6366f1|4f46e5|ec4899|d946ef|f43f5e)\b/gi;

const CHROMATIC_COLOR_GROUP = CHROMATIC_COLORS.join('|');

// Replacement patterns
const REPLACEMENTS: {
  id: string;
  regex: RegExp;
  replace: (match: string, ...groups: string[]) => string;
}[] = [
  // 1. bg-low (50..200) -> bg-muted
  {
    id: 'bg-low',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)bg-(?:${CHROMATIC_COLOR_GROUP})-(50|100|200)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', _shade = '', opacity = '') => {
      return `${prefix}bg-muted${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 2. bg-high (300..950) -> bg-primary
  {
    id: 'bg-high',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)bg-(?:${CHROMATIC_COLOR_GROUP})-(300|400|500|600|700|800|900|950)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', _shade = '', opacity = '') => {
      return `${prefix}bg-primary${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 3. text-low (50..200) -> text-foreground
  {
    id: 'text-low',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)text-(?:${CHROMATIC_COLOR_GROUP})-(50|100|200)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', _shade = '', opacity = '') => {
      return `${prefix}text-foreground${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 4. text-high (300..950) -> text-primary
  {
    id: 'text-high',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)text-(?:${CHROMATIC_COLOR_GROUP})-(300|400|500|600|700|800|900|950)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', _shade = '', opacity = '') => {
      return `${prefix}text-primary${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 5. border-low (50..200) -> border-border
  {
    id: 'border-low',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)border-(?:${CHROMATIC_COLOR_GROUP})-(50|100|200)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', _shade = '', opacity = '') => {
      return `${prefix}border-border${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 6. border-high (300..950) -> border-primary
  {
    id: 'border-high',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)border-(?:${CHROMATIC_COLOR_GROUP})-(300|400|500|600|700|800|900|950)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', _shade = '', opacity = '') => {
      return `${prefix}border-primary${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 7. ring -> ring-ring
  {
    id: 'ring',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)ring-(?:${CHROMATIC_COLOR_GROUP})-(?:\\d+)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', opacity = '') => {
      return `${prefix}ring-ring${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 8. outline -> outline-ring
  {
    id: 'outline',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)outline-(?:${CHROMATIC_COLOR_GROUP})-(?:\\d+)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', opacity = '') => {
      return `${prefix}outline-ring${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 9. fill -> fill-primary
  {
    id: 'fill',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)fill-(?:${CHROMATIC_COLOR_GROUP})-(?:\\d+)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '') => {
      return `${prefix}fill-primary`;
    },
  },
  // 10. stroke -> stroke-primary
  {
    id: 'stroke',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)stroke-(?:${CHROMATIC_COLOR_GROUP})-(?:\\d+)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '') => {
      return `${prefix}stroke-primary`;
    },
  },
  // 11. shadow -> shadow-foreground/NN (capped at /20)
  {
    id: 'shadow',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)shadow-(?:${CHROMATIC_COLOR_GROUP})-(?:\\d+)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', opacity = '') => {
      const opNum = opacity ? parseInt(opacity, 10) : 10;
      const capped = Math.min(opNum, 20);
      return `${prefix}shadow-foreground/${capped}`;
    },
  },
  // 12. gradient from/via/to low (50..200) -> -muted
  {
    id: 'gradient-stop-low',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)(from|via|to)-(?:${CHROMATIC_COLOR_GROUP})-(50|100|200)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', stop = 'from', _shade = '', opacity = '') => {
      return `${prefix}${stop}-muted${opacity ? `/${opacity}` : ''}`;
    },
  },
  // 13. gradient from/via/to high (300..950) -> -primary
  {
    id: 'gradient-stop-high',
    regex: new RegExp(
      `((?:[a-zA-Z0-9_-]+:)*)(from|via|to)-(?:${CHROMATIC_COLOR_GROUP})-(300|400|500|600|700|800|900|950)(?:\\/(\\d+))?(?=[\\s"'` + '`])',
      'g'
    ),
    replace: (_match, prefix = '', stop = 'from', _shade = '', opacity = '') => {
      return `${prefix}${stop}-primary${opacity ? `/${opacity}` : ''}`;
    },
  },
];

function shouldScanFile(filePath: string, rootDir: string): boolean {
  const norm = filePath.replace(/\\/g, '/');
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');

  if (
    norm.includes('/node_modules/') ||
    norm.includes('/.next/') ||
    norm.includes('/dist/') ||
    norm.includes('/.turbo/')
  ) {
    return false;
  }

  // Scope 1: packages/ui/src/
  if (rel.startsWith('packages/ui/src/')) {
    return rel.endsWith('.tsx') || rel.endsWith('.ts');
  }

  // Scope 2: apps/docs/app/ (EXCLUDE components/templates/)
  if (rel.startsWith('apps/docs/app/')) {
    if (rel.startsWith('apps/docs/app/components/templates/')) {
      return false; // Skip templates as instructed
    }
    return rel.endsWith('.tsx') || rel.endsWith('.ts');
  }

  // Scope 3: packages/cli/src/ (EXCLUDE registry/ and config theme definitions)
  if (rel.startsWith('packages/cli/src/')) {
    if (rel.startsWith('packages/cli/src/registry/')) {
      return false;
    }
    if (rel === 'packages/cli/src/utils/config.ts') {
      return false;
    }
    return rel.endsWith('.ts');
  }

  return false;
}

function collectFiles(dir: string, rootDir: string, acc: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== 'node_modules' &&
        entry.name !== '.next' &&
        entry.name !== 'dist' &&
        entry.name !== '.turbo'
      ) {
        collectFiles(fullPath, rootDir, acc);
      }
    } else if (entry.isFile()) {
      if (shouldScanFile(fullPath, rootDir)) {
        acc.push(fullPath);
      }
    }
  }
  return acc;
}

function isCanvasOrShaderContext(line: string): boolean {
  return (
    line.includes('getContext("2d")') ||
    line.includes('ctx.') ||
    line.includes('canvasRef') ||
    line.includes('requestAnimationFrame') ||
    line.includes('THREE.') ||
    line.includes('shader') ||
    line.includes('Particle') ||
    line.includes('particles')
  );
}

function processFile(filePath: string, rootDir: string): FileReport {
  const relativeFilePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  const replacements: ReplacementRecord[] = [];
  const gradientReviews: { line: number; text: string }[] = [];
  const manualReviews: { line: number; text: string; reason: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const rawLine = lines[i];

    // Skip lines with /* mono-keep */ or // mono-keep
    if (rawLine.includes('/* mono-keep */') || rawLine.includes('// mono-keep')) {
      continue;
    }

    // Check for canvas / particle manual reviews
    if (isCanvasOrShaderContext(rawLine)) {
      if (
        CHROMATIC_HEX_REGEX.test(rawLine) ||
        new RegExp(`(?:${CHROMATIC_COLOR_GROUP})`).test(rawLine)
      ) {
        manualReviews.push({
          line: lineNum,
          text: rawLine.trim().slice(0, 100),
          reason: 'Canvas / Shader animation or particle color context',
        });
      }
    }

    // Check for gradients requiring review
    if (
      rawLine.includes('bg-gradient-') ||
      rawLine.includes('bg-clip-text') ||
      rawLine.includes('text-transparent')
    ) {
      if (new RegExp(`(?:${CHROMATIC_COLOR_GROUP})`).test(rawLine)) {
        gradientReviews.push({
          line: lineNum,
          text: rawLine.trim().slice(0, 100),
        });
      }
    }

    let modifiedLine = rawLine;

    // Apply regex replacements
    for (const rep of REPLACEMENTS) {
      if (rep.regex.test(modifiedLine)) {
        const prev = modifiedLine;
        modifiedLine = modifiedLine.replace(rep.regex, (match, ...groups) =>
          rep.replace(match, ...groups)
        );
        if (prev !== modifiedLine) {
          replacements.push({
            rule: rep.id,
            before: prev.trim().slice(0, 90),
            after: modifiedLine.trim().slice(0, 90),
            line: lineNum,
          });
        }
      }
    }

    // Check for inline hex colors (non-canvas)
    if (!isCanvasOrShaderContext(rawLine) && CHROMATIC_HEX_REGEX.test(modifiedLine)) {
      // If it looks like inline styles or string values, flag for manual review or replace if unambiguous
      manualReviews.push({
        line: lineNum,
        text: modifiedLine.trim().slice(0, 100),
        reason: 'Hardcoded chromatic hex literal',
      });
    }
  }

  return {
    filePath,
    relativeFilePath,
    replacements,
    gradientReviews,
    manualReviews,
  };
}

function applyTransformationsToFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const newLines = lines.map((line) => {
    if (line.includes('/* mono-keep */') || line.includes('// mono-keep')) {
      return line;
    }
    let cur = line;
    for (const rep of REPLACEMENTS) {
      cur = cur.replace(rep.regex, (match, ...groups) =>
        rep.replace(match, ...groups)
      );
    }
    return cur;
  });

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
}

export function runCodemod(isWrite: boolean): CodemodSummary {
  const rootDir = path.resolve(__dirname, '..');
  const allFiles = collectFiles(rootDir, rootDir);

  const reports: FileReport[] = [];
  const replacementsByRule: Record<string, number> = {};
  const modifiedFiles: string[] = [];
  const gradientReviewFiles: { file: string; line: number; snippet: string }[] = [];
  const manualReviewItems: {
    file: string;
    line: number;
    reason: string;
    snippet: string;
  }[] = [];

  for (const file of allFiles) {
    const report = processFile(file, rootDir);
    reports.push(report);

    if (report.replacements.length > 0) {
      modifiedFiles.push(report.relativeFilePath);
      for (const r of report.replacements) {
        replacementsByRule[r.rule] = (replacementsByRule[r.rule] || 0) + 1;
      }
      if (isWrite) {
        applyTransformationsToFile(file);
      }
    }

    for (const g of report.gradientReviews) {
      gradientReviewFiles.push({
        file: report.relativeFilePath,
        line: g.line,
        snippet: g.text,
      });
    }

    for (const m of report.manualReviews) {
      manualReviewItems.push({
        file: report.relativeFilePath,
        line: m.line,
        reason: m.reason,
        snippet: m.text,
      });
    }
  }

  const totalReplacements = Object.values(replacementsByRule).reduce(
    (a, b) => a + b,
    0
  );

  return {
    mode: isWrite ? 'write' : 'dry-run',
    scannedFilesCount: allFiles.length,
    modifiedFilesCount: modifiedFiles.length,
    totalReplacements,
    replacementsByRule,
    modifiedFiles,
    gradientReviewFiles,
    manualReviewItems,
  };
}

// Execution entry point
const args = process.argv.slice(2);
const isWrite = args.includes('--write');
const summary = runCodemod(isWrite);

// Output JSON to file for structured reading
const outJsonPath = path.resolve(
  __dirname,
  '..',
  'scratch',
  'codemod-summary.json'
);
fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
fs.writeFileSync(outJsonPath, JSON.stringify(summary, null, 2), 'utf-8');

console.log(
  `\n=== MONOCHROME CODEMOD (${summary.mode.toUpperCase()}) ===\n`
);
console.log(`Scanned files: ${summary.scannedFilesCount}`);
console.log(`Files with replacements: ${summary.modifiedFilesCount}`);
console.log(`Total replacements: ${summary.totalReplacements}`);
console.log('\nReplacements by rule:');
for (const [rule, count] of Object.entries(summary.replacementsByRule)) {
  console.log(`  - ${rule}: ${count}`);
}
console.log(`\nGradient reviews logged: ${summary.gradientReviewFiles.length}`);
console.log(`Manual reviews logged: ${summary.manualReviewItems.length}`);
console.log(`Summary written to: ${outJsonPath}\n`);
