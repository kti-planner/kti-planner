import { expect } from 'playwright/test';
import { loginAsAdmin, loginAsTeacher, test } from './fixtures';

test('Does / redirect to correct page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/semesters\/([0-9]{4}-(summer|winter)\/)?/);
});

test('Can switch languages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toContainText('Sign in');
    expect(await page.evaluate(() => window.langId)).toBe('en');

    await page.getByRole('link', { name: 'Polski' }).click();

    await expect(page.getByRole('navigation')).toContainText('Zaloguj się');
    expect(await page.evaluate(() => window.langId)).toBe('pl');
});

test.describe('Dropdown menu', () => {
    test.only('Dropdown menu is visible for logged-in user', async ({ page }) => {
        await page.goto('/');
        await loginAsAdmin(page);

        await expect(page.locator('.navbar').getByText('A', { exact: true })).toBeVisible();

        await page.locator('.navbar').getByText('A', { exact: true }).click();
        await page.locator('.navbar').getByRole('button', { name: 'Sign out' }).click();

        await page.waitForTimeout(1000);
        await loginAsTeacher(page);

        await expect(page.locator('.navbar').getByText('BN', { exact: true })).toBeVisible();
    });

    test('Can open dropdown menu', async ({ page }) => {
        await page.goto('/');
        await loginAsAdmin(page);

        await page.locator('.navbar').getByText('A', { exact: true }).click();

        await expect(page.locator('.navbar').getByText('Admin')).toBeVisible();
        await expect(page.locator('.navbar').getByRole('link', { name: 'Profile' })).toBeVisible();
        await expect(page.locator('.navbar').getByRole('link', { name: 'Users' })).toBeVisible();
        await expect(page.locator('.navbar').getByRole('link', { name: 'Classrooms' })).toBeVisible();
        await expect(page.locator('.navbar').getByRole('button', { name: 'Sign out' })).toBeVisible();
    });

    test('Can access dropdown menu pages', async ({ page }) => {
        await page.goto('/');
        await loginAsAdmin(page);

        await page.locator('.navbar').getByText('A', { exact: true }).click();
        await page.locator('.navbar').getByRole('link', { name: 'Users' }).click();
        await expect(page).toHaveURL('/users/');

        await page.locator('.navbar').getByText('A', { exact: true }).click();
        await page.locator('.navbar').getByRole('link', { name: 'Profile' }).click();
        await expect(page).toHaveURL('/profile/');

        await page.locator('.navbar').getByText('A', { exact: true }).click();
        await page.locator('.navbar').getByRole('link', { name: 'Classrooms' }).click();
        await expect(page).toHaveURL('/classrooms/');

        await page.locator('.navbar').getByText('A', { exact: true }).click();
        await page.locator('.navbar').getByRole('button', { name: 'Sign out' }).click();
        await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    });
});
