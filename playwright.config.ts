import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: 'tests',
    fullyParallel: true,
    timeout: 30000,
    expect: { timeout: 5000 },
    retries: process.env.CI ? 0 : 0,
    workers: process.env.CI ? 2 : undefined,
    use: {
        baseURL: 'https://www.earth-summit.com',
        headless: process.env.CI ? true : false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        // { name: 'firefox', use: { browserName: 'firefox' } },
        // { name: 'webkit', use: { browserName: 'webkit' } },
        { name: 'iphone15', use: { ...devices['iPhone 15 Pro Max'] } },
        // { name: 'ipad', use: { ...devices['iPad Air'] } },
    ],
    reporter: [['list'], ['html', { open: 'always' }]],
};

export default config;
