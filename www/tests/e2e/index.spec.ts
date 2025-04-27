import { test } from '@playwright/test';

test('Loads index page', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.navbar');
});
