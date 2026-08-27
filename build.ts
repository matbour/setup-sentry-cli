import { readFile } from 'node:fs/promises';
import type { BunPlugin } from 'bun';

/**
 * Bun inlines `__dirname` in CommonJS dependencies as the absolute path of the build machine, which makes `dist/`
 * differ between machines and leaks local paths. Only `@actions/tool-cache` uses it (to locate a bundled 7zr.exe that
 * we do not ship anyway), so we swap it for a runtime lookup before bundling.
 */
const portableDirname: BunPlugin = {
  name: 'portable-dirname',
  setup(build) {
    build.onLoad({ filter: /node_modules\/@actions\/tool-cache\/.*\.js$/ }, async ({ path }) => {
      let contents = await readFile(path, 'utf8');
      if (contents.includes('__dirname')) {
        contents = `const __runtime_dirname = require("node:path").dirname(process.argv[1] ?? "");\n${contents.replaceAll('__dirname', '__runtime_dirname')}`;
      }
      return { contents, loader: 'js' };
    });
  },
};

const result = await Bun.build({
  entrypoints: ['src/main.ts'],
  outdir: 'dist',
  target: 'node',
  format: 'cjs',
  minify: true,
  sourcemap: 'linked',
  plugins: [portableDirname],
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

const cwd = process.cwd();
for (const file of ['dist/main.js', 'dist/main.js.map']) {
  if ((await readFile(file, 'utf8')).includes(cwd)) {
    console.error(`${file} contains the build path ${cwd}; the bundle is not reproducible.`);
    process.exit(1);
  }
}

console.log(`Built dist/main.js (${((result.outputs[0]?.size ?? 0) / 1024) | 0} KB)`);
