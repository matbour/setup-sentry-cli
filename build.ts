import { readFile, writeFile } from 'node:fs/promises';

/**
 * Bundle the action with Bun, then make the output reproducible.
 *
 * Bun inlines `__dirname` for CommonJS dependencies (here `@actions/tool-cache`) as the absolute path of the build
 * machine, which makes `dist/` differ between machines and leaks local paths. The value is only used by tool-cache to
 * locate a bundled 7zr.exe we do not ship, so we restore Node's runtime `__dirname` instead.
 */
const result = await Bun.build({
  entrypoints: ['src/main.ts'],
  outdir: 'dist',
  target: 'node',
  format: 'cjs',
  minify: true,
  sourcemap: 'linked',
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

const cwd = process.cwd();
const bundlePath = 'dist/main.js';
let bundle = await readFile(bundlePath, 'utf8');
bundle = bundle.replaceAll(/__dirname="[^"]*\/node_modules\/[^"]*"/g, '__dirname=__dirname');
await writeFile(bundlePath, bundle);

for (const file of ['dist/main.js', 'dist/main.js.map']) {
  if ((await readFile(file, 'utf8')).includes(cwd)) {
    console.error(`${file} contains the build path ${cwd}; the bundle is not reproducible.`);
    process.exit(1);
  }
}

console.log(`Built ${bundlePath} (${(bundle.length / 1024).toFixed(0)} KB)`);
