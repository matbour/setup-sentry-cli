import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs'],
  sourcemap: true,
  clean: true,
  noExternal: [/.*/],
});
