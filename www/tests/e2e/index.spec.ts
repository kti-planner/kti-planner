import { expect } from 'playwright/test';
import { test } from './test-setup';

test('Can switch languages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#signin-link')).toContainText('Zaloguj się');
    expect(await page.evaluate(() => window.langId)).toBe('pl');

    await page.click('#lang-switch-link');
    await page.waitForURL('/');

    await expect(page.locator('#signin-link')).toContainText('Sign in');
    expect(await page.evaluate(() => window.langId)).toBe('en');
});
