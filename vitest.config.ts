import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [{
      extends: true,
      test: {
        globals: true,
        // Default environment for logic tests
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,ts}'],
        browser: {
          enabled: true,
          name: 'chromium',
          // You can also use 'firefox' or 'webkit'
          provider: 'playwright',
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
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
}));