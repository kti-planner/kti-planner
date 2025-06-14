import { expect } from 'playwright/test';
import { test } from './test-setup';

test('Can access semesters from /', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('Winter semester 2024/2025');
    await expect(page.locator('body')).toContainText('Summer semester 2023/2024');
    await expect(page.locator('body')).toContainText('Winter semester 2023/2024');
});

test('Can access semesters from /semesters/', async ({ page }) => {
    await page.goto('/semesters/');

    await expect(page.locator('body')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('Winter semester 2024/2025');
    await expect(page.locator('body')).toContainText('Summer semester 2023/2024');
    await expect(page.locator('body')).toContainText('Winter semester 2023/2024');
});

test('Can access semester page', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Summer semester 2024/2025').click();
    await page.waitForURL('/semesters/summer-2024/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
});
