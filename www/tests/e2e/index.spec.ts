import { expect } from 'playwright/test';
import { test } from './test-setup';

test('Can switch languages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toContainText('Sign in');
    expect(await page.evaluate(() => window.langId)).toBe('en');

    await page.getByRole('link', { name: 'Polski' }).click();

    await expect(page.getByRole('navigation')).toContainText('Zaloguj się');
    expect(await page.evaluate(() => window.langId)).toBe('pl');
});
