const fs = require('fs');
const path = require('path');
const ts = require('../apps/docs/node_modules/typescript');
const assert = require('assert');

function loadTsModule(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const m = { exports: {} };
  const dirname = path.dirname(filePath);
  const customRequire = (id) => {
    if (id.startsWith('.')) {
      const target = path.resolve(dirname, id.endsWith('.ts') ? id : `${id}.ts`);
      return loadTsModule(target);
    }
    return require(id);
  };

  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', compiled);
  fn(m.exports, customRequire, m, filePath, dirname);
  return m.exports;
}

const frameworksPath = path.resolve(__dirname, '../apps/docs/lib/create/frameworks.ts');
const buildCmdPath = path.resolve(__dirname, '../apps/docs/lib/create/buildCreateCommand.ts');

const { FRAMEWORK_CONFIGS, getFrameworkConfig } = loadTsModule(frameworksPath);
const { buildCreateCommand, sanitizeProjectName, getPackageManagerRunners } = loadTsModule(buildCmdPath);

console.log('--- Running buildCreateCommand Tests ---');

// Test 1: Sanitization
assert.strictEqual(sanitizeProjectName('my app & rm -rf /'), 'my-app-rm-rf');
assert.strictEqual(sanitizeProjectName('  my_project.app-1  '), 'my_project.app-1');
assert.strictEqual(sanitizeProjectName('$$$###'), 'my-nexore-app');
assert.strictEqual(sanitizeProjectName(''), 'my-nexore-app');
assert.strictEqual(sanitizeProjectName(undefined), 'my-nexore-app');
console.log('✔ Test 1 passed: sanitizeProjectName handles dirty inputs and defaults safely.');

// Test 2: Package Manager Runners
assert.strictEqual(getPackageManagerRunners('pnpm').createRunner, 'pnpm dlx nexoreui');
assert.strictEqual(getPackageManagerRunners('npm').createRunner, 'npx nexoreui');
assert.strictEqual(getPackageManagerRunners('bun').createRunner, 'bunx nexoreui');
assert.strictEqual(getPackageManagerRunners('yarn').createRunner, 'yarn dlx nexoreui');
console.log('✔ Test 2 passed: getPackageManagerRunners returns correct CLI runners.');

// Test 3: Matrix test for all package managers × all frameworks
const pms = ['pnpm', 'npm', 'yarn', 'bun'];
const frameworks = ['next-app', 'next-pages', 'vite', 'remix', 'astro', 'monorepo'];

let count = 0;
for (const pm of pms) {
  for (const fw of frameworks) {
    const result = buildCreateCommand({
      packageManager: pm,
      projectName: 'demo-app',
      framework: fw,
      presetId: 'starter',
      selectedComponents: ['button', 'card'],
      themeColor: 'slate',
      radius: '0.625',
      fontFamily: 'geist',
      density: 'default',
      animationStyle: 'subtle',
      defaultMode: 'system',
    });

    const fwConfig = getFrameworkConfig(fw);
    const runners = getPackageManagerRunners(pm);

    assert.ok(result.createCommand.startsWith(runners.createRunner), `createCommand should start with ${runners.createRunner}`);
    assert.ok(result.createCommand.includes(`create demo-app`), `createCommand should include project name`);
    assert.ok(result.createCommand.includes(`--framework ${fwConfig.cliFlag}`), `createCommand must include --framework ${fwConfig.cliFlag}`);
    assert.ok(result.createCommand.includes(`--theme slate`), `createCommand must include --theme slate`);
    assert.ok(result.createCommand.includes(`--radius 0.625`), `createCommand must include --radius 0.625`);
    assert.ok(result.createCommand.includes(`--mode system`), `createCommand must include --mode system`);

    assert.ok(result.addCommand.startsWith(runners.addRunner), `addCommand should start with ${runners.addRunner}`);
    assert.ok(result.addCommand.includes('button card'), `addCommand should include specified components`);
    assert.ok(result.fullCliCommand.includes(' && '), `fullCliCommand should chain init and add`);
    count++;
  }
}
console.log(`✔ Test 3 passed: ${count} framework × package manager combinations generated valid commands.`);

// Test 4: Full Suite preset gives clean --all flag with NO prepended items
const fullResult = buildCreateCommand({
  packageManager: 'pnpm',
  projectName: 'full-stack',
  framework: 'next-app',
  presetId: 'full',
  selectedComponents: 'all',
  themeColor: 'emerald',
  radius: '0.5',
  fontFamily: 'inter',
  density: 'compact',
  animationStyle: 'energetic',
  defaultMode: 'dark',
});

assert.strictEqual(fullResult.addCommand, 'pnpm dlx nexoreui add --all');
assert.ok(!fullResult.addCommand.includes('button input switch slider'));
assert.ok(fullResult.fullCliCommand.includes('pnpm dlx nexoreui add --all'));
console.log('✔ Test 4 passed: Full suite cleanly outputs "pnpm dlx nexoreui add --all" without prepending component lists.');

// Test 5: 0 components selected gives addCommand: null and clean single command
const zeroResult = buildCreateCommand({
  packageManager: 'npm',
  projectName: 'zero-comps',
  framework: 'vite',
  presetId: 'custom',
  selectedComponents: [],
  themeColor: 'cyan',
  radius: '0',
  fontFamily: 'jetbrains',
  density: 'relaxed',
  animationStyle: 'none',
  defaultMode: 'light',
});

assert.strictEqual(zeroResult.addCommand, null);
assert.strictEqual(zeroResult.fullCliCommand, zeroResult.initCommand);
assert.ok(!zeroResult.fullCliCommand.includes('&&'));
console.log('✔ Test 5 passed: 0 components selection results in addCommand: null and no "&&" chaining.');

console.log('🎉 ALL buildCreateCommand TESTS PASSED SUCCESSFULLY!');
