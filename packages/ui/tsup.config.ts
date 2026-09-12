import { defineConfig } from 'tsup';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  entry: ['src/index.ts', 'src/index.css'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  onSuccess: async () => {
    const distDir = path.resolve(__dirname, 'dist');
    const indexCss = path.join(distDir, 'index.css');
    const stylesCss = path.join(distDir, 'styles.css');
    if (fs.existsSync(indexCss)) {
      fs.copyFileSync(indexCss, stylesCss);
    }
  },
});
