import { expect } from 'playwright/test';
import { test } from './fixtures';

test('Can access exercises list', async ({ page }) => {
    await page.goto('/semesters/summer-2024/');
    await page.getByText('Lokalne sieci bezprzewodowe').click();

    await expect(page.locator('body')).toContainText('Tryby pracy punktów dostępowych');
    await expect(page.locator('body')).toContainText('Wydajność sieci standardów IEEE 802.11');
    await expect(page.locator('body')).toContainText('Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11');
    await expect(page.locator('body')).toContainText(
        'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11 cz. II',
    );
    await expect(page.locator('body')).toContainText('Emulacja sieci bezprzewodowych');
    await expect(page.locator('body')).toContainText('Radius');
});

test('Can access exercise page', async ({ page }) => {
    await page.goto('/semesters/summer-2024/');
    await page.getByText('Lokalne sieci bezprzewodowe').click();
    await page.getByText('Tryby pracy punktów dostępowych').click();

    await expect(page.locator('.breadcrumb')).toContainText('Tryby pracy punktów dostępowych');
});
