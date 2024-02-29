import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  sourcemap: true,
  clean: true,
  noExternal: [/.*/],
});
