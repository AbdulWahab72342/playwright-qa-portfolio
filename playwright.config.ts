import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        // Locally, use the installed Google Chrome; CI uses Playwright's bundled Chromium.
        channel: process.env.CI ? undefined : 'chrome',
        baseURL: 'https://www.saucedemo.com',
        // Sauce Demo uses data-test attributes, so getByTestId() maps to them.
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
        // Restful Booker answers 418 to requests that do not accept JSON or XML.
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
