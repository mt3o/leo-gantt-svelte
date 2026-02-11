import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { playwright } from '@vitest/browser-playwright';



export default defineConfig({
  test: {
    projects: [{
      extends: './vite.config.ts',
      test: {
        globals: true,
        // Default environment for logic tests
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}'],
        browser: {
          enabled: true,
          // You can also use 'firefox' or 'webkit'
          provider: playwright(),
          // This allows running browser tests headlessly in CI
          headless: !!process.env.CI,
          // We only want to run specific tests in the browser
          // Usually component tests or interaction-heavy tests
          instances: [{
            browser: 'chromium'
          }]
        },
        // If you want to separate Node (logic) and Browser (UI) tests
        // you can use different file extensions or directories
        typecheck: {
          enabled: true
        }
      }
    }]
  }
});
