import { expect } from 'playwright/test';
import { test } from './test-setup';

test('Can switch languages', async ({ page }) => {
    await page.goto('/');
    const signInText: Record<LangId, string> = {
        'en': 'Sign in',
        'pl': 'Zaloguj się',
    };
    const defaultLang = await page.evaluate(() => window.langId);
    const signInPageText = await page.locator('#signin-link').innerText();
    expect(signInPageText).toBe(signInText[defaultLang]);

    await page.click('#lang-switch-link');
    await page.waitForURL('/');

    const newLang = await page.evaluate(() => window.langId);
    expect(newLang).not.toBe(defaultLang);
    const newSignInPageText = await page.locator('#signin-link').innerText();
    expect(newSignInPageText).toBe(signInText[newLang]);
});
