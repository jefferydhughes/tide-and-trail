import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e', fullyParallel: true, retries: 1,
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run dev -- --webpack', url: 'http://127.0.0.1:3000', reuseExistingServer: false, timeout: 120_000,
    // Exercise the registration UI without using a real Square access token.
    env: { VERCEL_ENV: 'preview', SQUARE_ACCESS_TOKEN: 'test-only-not-a-real-token', NOMADS_REGISTRATION_PAUSED: 'false' },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
