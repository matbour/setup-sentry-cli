#!/usr/bin/env node
/**
 * Build the GitHub Action bundle with esbuild.
 * Feel free to modify the esbuild configuration so it fits to your needs.
 * Reference: https://esbuild.github.io/api/
 */
require('esbuild')
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    platform: 'node',
    target: 'es2019',
    outfile: 'dist/index.js',
    sourcemap: true,
  })
  .catch(() => process.exit(1));
