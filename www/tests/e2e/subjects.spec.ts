import { expect } from 'playwright/test';
import { test } from './fixtures';

test('Can access subject list', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await expect(page.locator('body')).toContainText('Lokalne sieci bezprzewodowe');
    await expect(page.locator('body')).toContainText('Zarządzanie bezpieczeństwem sieci');
});

test('Can access subject page', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await page.getByText('Lokalne sieci bezprzewodowe').click();
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe');
});
