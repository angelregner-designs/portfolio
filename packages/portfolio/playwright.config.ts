import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  // Cross-browser + responsive viewport testing
  projects: [
    // Mobile (428px)
    {
      name: 'mobile-chrome',
      use: { viewport: { width: 428, height: 926 } },
    },
    {
      name: 'mobile-safari',
      use: { viewport: { width: 428, height: 926 }, browserName: 'webkit' },
    },

    // Tablet (768px)
    {
      name: 'tablet-chrome',
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'tablet-safari',
      use: { viewport: { width: 768, height: 1024 }, browserName: 'webkit' },
    },

    // Desktop (1440px)
    {
      name: 'desktop-chrome',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'desktop-firefox',
      use: { viewport: { width: 1440, height: 900 }, browserName: 'firefox' },
    },
    {
      name: 'desktop-safari',
      use: { viewport: { width: 1440, height: 900 }, browserName: 'webkit' },
    },
  ],

  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // 1% tolerance for visual differences
      timeout: 15000, // Allow more time for animations to settle
      animations: 'disabled', // Disable CSS animations for stable screenshots
    },
  },

  // Start dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
