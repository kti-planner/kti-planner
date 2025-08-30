import { type Page, test as base } from '@playwright/test';
import { restoreDb } from './db-utils';

declare global {
    interface Window {
        langId: LangId;
    }
}

export const test = base.extend({
    page: async ({ page }, use) => {
        // Fail tests on exceptions or console errors
        page.on('pageerror', err => {
            throw new Error(`Unhandled page exception: ${err.stack ?? err}`);
        });

        page.on('console', msg => {
            if (msg.type() === 'error') {
                throw new Error(`Console error: ${msg.text()} ${JSON.stringify(msg.location())}`);
            }
        });

        await restoreDb('mock.sql');
        await use(page);
    },
});

export async function login(page: Page) {
    await page.locator('.navbar').getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();
}

export async function loginAsTeacher(page: Page) {
    await page.locator('.navbar').getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('bogdan@nowak.pl');
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();
}
