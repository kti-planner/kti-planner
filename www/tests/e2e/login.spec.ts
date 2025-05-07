import { expect } from '@playwright/test';
import { test } from './test-setup';

test('Can sign in and logout', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('.navbar #username')).toHaveText('Admin');

    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('Can sign in with keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeFocused();
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');

    await expect(page.locator('.navbar #username')).toHaveText('Admin');
});

test('Wrong password', async ({ page }) => {
    await page.goto('/login/');

    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('form')).toContainText('Login failed.');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('admin@admin.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('');

    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('.navbar #username')).toHaveText('Admin');
});

test('Wrong email', async ({ page }) => {
    await page.goto('/login/');

    await page.getByRole('textbox', { name: 'Email' }).fill('admin@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('form')).toContainText('Login failed.');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('admin@test.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('');

    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();

    await expect(page.locator('.navbar #username')).toHaveText('Admin');
});
