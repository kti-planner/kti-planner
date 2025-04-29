// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
    use: {
        baseURL: 'http://localhost:8080',
        video: process.env.CI ? 'off' : 'retain-on-failure',
        locale: 'pl-PL',
        timezoneId: 'Europe/Warsaw',
    },
    reporter: 'line',
    testMatch: 'www/tests/e2e/**/*.spec.ts',
});
