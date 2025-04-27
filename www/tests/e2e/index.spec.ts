import { test } from '@playwright/test';

test('Loads index page', async ({ page }) => {
    await page.waitForSelector('.navbar');
});
