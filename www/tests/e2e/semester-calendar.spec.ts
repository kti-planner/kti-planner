import { expect } from 'playwright/test';
import { expectSelectedOptionText, loginAsTeacher, test } from 'tests/e2e/fixtures';

test('Can access semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByText('29 Sept – 5 Oct 2025')).toBeVisible();

    await expect(
        page
            .locator('.calendar-wrapper a')
            .filter({ hasText: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V' })
            .first(),
    ).toBeVisible();
});

test('Can use subjects filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(
        page
            .locator('.calendar-wrapper a')
            .filter({ hasText: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V' })
            .first(),
    ).toBeVisible();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: 'Sieci komputerowe - Informatyka sem. V' }).first(),
    ).toBeVisible();

    await page.locator('label', { hasText: 'Sieci komputerowe - Informatyka sem. V' }).click();

    await expect(
        page
            .locator('.calendar-wrapper a')
            .filter({ hasText: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V' })
            .first(),
    ).not.toBeVisible();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: 'Sieci komputerowe - Informatyka sem. V' }).first(),
    ).toBeVisible();

    await page
        .locator('label', {
            hasText: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V',
        })
        .click();

    await expect(
        page
            .locator('.calendar-wrapper a')
            .filter({ hasText: 'Wstęp do sieci komputerowych - Automatyka i Robotyka, Inżynieria biomedyczna sem. V' })
            .first(),
    ).toBeVisible();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: 'Sieci komputerowe - Informatyka sem. V' }).first(),
    ).toBeVisible();
});

test('Can use classrooms filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'EA 204' }).first()).toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'EA 142' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'EA 142' }).click();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'EA 204' }).first()).not.toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'EA 142' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'EA 204' }).click();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'EA 204' }).first()).toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'EA 142' }).first()).toBeVisible();
});

test('Can use teachers filter in semester calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'Bogdan Nowak' }).first()).toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'Jan Kowalski' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Jan Kowalski' }).click();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'Bogdan Nowak' }).first()).not.toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'Jan Kowalski' }).first()).toBeVisible();

    await page.locator('label', { hasText: 'Bogdan Nowak' }).click();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'Bogdan Nowak' }).first()).toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: 'Jan Kowalski' }).first()).toBeVisible();
});

test('Can view class details', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page
        .locator('.calendar-wrapper a')
        .filter({ hasText: '11:15 - 13:00' })
        .filter({ hasText: 'Sieci komputerowe' })
        .click();

    await expect(page.getByRole('heading', { name: 'Class details' })).toBeVisible();

    await expect(
        page.locator('.modal').getByRole('link', { name: 'Sieci komputerowe - Informatyka sem. V', exact: true }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: 'Diagnostyka sieci IPv4', exact: true })).toBeVisible();
    await expect(page.getByText('Laboratory group: 1A')).toBeVisible();
    await expect(page.getByText('Classroom: EA 142')).toBeVisible();
    await expect(page.getByText('Date: 1.10.2025 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('Teacher: Jan Kowalski')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Save' })).not.toBeVisible();
});

test('Can edit class time when logged in', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page
        .locator('.calendar-wrapper a')
        .filter({ hasText: '11:15 - 13:00' })
        .filter({ hasText: 'Sieci komputerowe' })
        .click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();

    await expect(
        page.locator('.modal').getByRole('link', { name: 'Sieci komputerowe - Informatyka sem. V', exact: true }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: 'Diagnostyka sieci IPv4', exact: true })).toBeVisible();
    await expect(page.getByText('Laboratory group: 1A')).toBeVisible();
    await expect(page.getByText('Classroom: EA 142')).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-01');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('11:15');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('13:00');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Teacher' }), 'Jan Kowalski');

    await page.getByRole('textbox', { name: 'Date' }).fill('2025-10-01');
    await page.getByRole('textbox', { name: 'Start time' }).fill('13:15');
    await page.getByRole('textbox', { name: 'End time' }).fill('15:00');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
        page
            .locator('.calendar-wrapper a')
            .filter({ hasText: '11:15 - 13:00' })
            .filter({ hasText: 'Sieci komputerowe' }),
    ).not.toBeVisible();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: '13:15 - 15:00' })).toBeVisible();
});
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: '13:15 - 15:00' })).toBeVisible();
});
