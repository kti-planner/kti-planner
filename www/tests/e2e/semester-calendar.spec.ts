import { expect } from 'playwright/test';
import { loginAsTeacher, test } from 'tests/e2e/fixtures';

test('Can access semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByText('29 Sept – 5 Oct 2025')).toBeVisible();

    await expect(
        page.getByRole('gridcell', {
            name: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V',
        }),
    ).toBeVisible();
});

test('Can use subjects filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(
        page
            .getByRole('gridcell', {
                name: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V',
            })
            .first(),
    ).toBeVisible();

    await expect(page.getByRole('gridcell', { name: 'Sieci komputerowe - Informatyka sem. V' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Sieci komputerowe - Informatyka sem. V' }).click();

    await expect(
        page
            .getByRole('gridcell', {
                name: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V',
            })
            .first(),
    ).not.toBeVisible();

    await expect(page.getByRole('gridcell', { name: 'Sieci komputerowe - Informatyka sem. V' }).first()).toBeVisible();

    await page
        .locator('label', {
            hasText: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V',
        })
        .click();

    await expect(
        page
            .getByRole('gridcell', {
                name: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V',
            })
            .first(),
    ).toBeVisible();

    await expect(page.getByRole('gridcell', { name: 'Sieci komputerowe - Informatyka sem. V' }).first()).toBeVisible();
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

test('Can view class details', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page.getByRole('gridcell', { name: '11:15 - 13:00' }).click();
    await expect(page.getByRole('heading', { name: 'Class details' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).not.toBeVisible();
});

test('Can edit class time when logged in', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page.getByRole('gridcell', { name: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Start date' }).fill('2025-10-01T13:15');
    await page.getByRole('textbox', { name: 'End date' }).fill('2025-10-01T15:00');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('gridcell', { name: '11:15 - 13:00' })).not.toBeVisible();
    await expect(page.getByRole('gridcell', { name: '13:15 - 15:00' })).toBeVisible();
});
