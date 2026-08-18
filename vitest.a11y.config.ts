import { defineConfig } from 'vitest/config';

// A11y test config — runs axe-core scans against rendered DOM.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/tests/**/*.a11y.test.ts'],
  },
});
