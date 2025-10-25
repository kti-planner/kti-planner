// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'http://localhost:8080',
        video: process.env.CI ? 'off' : 'retain-on-failure',
        locale: 'en-US',
    },
    reporter: 'line',
    testMatch: 'www/tests/e2e/**/*.spec.ts',
    workers: 1,
    retries: 1,
    projects: [
        {
            name: 'setup db',
            testMatch: 'www/tests/e2e/global.setup.ts',
            teardown: 'cleanup db',
        },
        {
            name: 'chromium',
            use: devices['Desktop Chrome'],
            dependencies: ['setup db'],
        },
        {
            name: 'cleanup db',
            testMatch: 'www/tests/e2e/global.teardown.ts',
        },
    ],
});
