import { test } from './test-setup';

test('Loads index page', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.navbar');
});
