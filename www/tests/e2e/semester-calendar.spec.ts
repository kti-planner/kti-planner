import { expect } from 'playwright/test';
import { test } from 'tests/e2e/fixtures';

test('Can access semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByText('29 Sept – 5 Oct 2025')).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Wstęp do sieci komputerowych' })).toBeVisible();
});

test('Can use subjects filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByRole('gridcell', { name: 'Wstęp do sieci komputerowych' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Sieci komputerowe' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Sieci komputerowe' }).click();

    await expect(page.getByRole('gridcell', { name: 'Wstęp do sieci komputerowych' }).first()).not.toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Sieci komputerowe' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Wstęp do sieci komputerowych' }).click();

    await expect(page.getByRole('gridcell', { name: 'Wstęp do sieci komputerowych' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Sieci komputerowe' }).first()).toBeVisible();
});

test('Can use classrooms filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByRole('gridcell', { name: 'EA 204' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'EA 142' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'EA 142' }).click();

    await expect(page.getByRole('gridcell', { name: 'EA 204' }).first()).not.toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'EA 142' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'EA 204' }).click();

    await expect(page.getByRole('gridcell', { name: 'EA 204' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'EA 142' }).first()).toBeVisible();
});

test('Can use teachers filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByRole('gridcell', { name: 'Bogdan Nowak' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Jan Kowalski' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Jan Kowalski' }).click();

    await expect(page.getByRole('gridcell', { name: 'Bogdan Nowak' }).first()).not.toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Jan Kowalski' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Bogdan Nowak' }).click();

    await expect(page.getByRole('gridcell', { name: 'Bogdan Nowak' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'Jan Kowalski' }).first()).toBeVisible();
});
