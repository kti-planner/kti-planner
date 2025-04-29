import { expect } from '@playwright/test';
import { test } from './test-setup';

test('Can sign in and logout', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.locator('button').filter({ hasText: 'Sign in' }).click();

    await expect(page.getByRole('paragraph')).toContainText(
        'User uuid: 9f4eacbf-9cfc-4a08-8c35-fb8eabcdd897 User name: Admin User email: admin@admin.com',
    );

    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('paragraph')).toContainText('User not logged in');
});

test('Can sign in with keyboard navigation', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@admin.com');
    await page.getByRole('textbox', { name: 'Email' }).press('Tab');
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeFocused();
    await page.getByRole('textbox', { name: 'Password' }).fill('kti');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');

    await expect(page.getByRole('paragraph')).toContainText(
        'User uuid: 9f4eacbf-9cfc-4a08-8c35-fb8eabcdd897 User name: Admin User email: admin@admin.com',
    );
});
