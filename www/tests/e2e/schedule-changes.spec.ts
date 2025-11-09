import { expect } from 'playwright/test';
import { loginAsTeacher, test } from './fixtures';

test('Cannot access schedule changes list when logged-out', async ({ page }) => {
    await page.goto('/semesters/2025-winter/schedule-changes/');
    await expect(page).toHaveURL('/login/?next=%2Fsemesters%2F2025-winter%2Fschedule-changes%2F');
});

test('Can access schedule changes list when logged-in', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Edit semester' }).click();

    await page.getByRole('link', { name: 'Edit holidays and schedule changes' }).click();

    const page1 = await page.waitForEvent('popup');

    await expect(page1.getByRole('heading', { name: 'Schedule changes' })).toBeVisible();

    await expect(page1.getByText('February')).toBeVisible();
    await expect(page1.getByText('March')).toBeVisible();
    await expect(page1.getByText('April')).toBeVisible();
    await expect(page1.getByText('May')).toBeVisible();
    await expect(page1.getByText('June')).toBeVisible();
    await expect(page1.getByText('January')).not.toBeVisible();
    await expect(page1.getByText('July')).not.toBeVisible();

    await expect(page1.getByText('Monday', { exact: true })).toBeVisible();
    await expect(page1.getByText('Tuesday', { exact: true })).toBeVisible();
    await expect(page1.getByText('Wednesday', { exact: true })).toBeVisible();
    await expect(page1.getByText('Thursday', { exact: true })).toBeVisible();
    await expect(page1.getByText('Friday', { exact: true })).toBeVisible();
    await expect(page1.getByText('Saturday', { exact: true })).toBeVisible();
    await expect(page1.getByText('Sunday', { exact: true })).toBeVisible();

    await expect(page1.getByTitle('24.02.2025', { exact: true })).toBeVisible();
    await expect(page1.getByTitle('1.05.2025\nholiday', { exact: true })).toBeVisible();
    await expect(page1.getByTitle('8.06.2025\nholiday', { exact: true })).toBeVisible();
    await expect(page1.getByTitle("16.04.2025\nfriday's schedule", { exact: true })).toBeVisible();
    await expect(page1.getByTitle('3.04.2025', { exact: true })).toBeVisible();

    await expect(page1.getByTitle('24.02.2025', { exact: true })).toHaveText('24');
    await expect(page1.getByTitle('1.05.2025\nholiday', { exact: true })).toHaveText('1');
    await expect(page1.getByTitle('8.06.2025\nholiday', { exact: true })).toHaveText('8');
    await expect(page1.getByTitle("16.04.2025\nfriday's schedule", { exact: true })).toHaveText('16');
    await expect(page1.getByTitle('3.04.2025', { exact: true })).toHaveText('3');

    await expect(page1.getByTitle('24.02.2025', { exact: true })).not.toContainClass('text-bg-danger');
    await expect(page1.getByTitle('1.05.2025\nholiday', { exact: true })).toContainClass('text-bg-danger');
    await expect(page1.getByTitle('8.06.2025\nholiday', { exact: true })).toContainClass('text-bg-danger');
    await expect(page1.getByTitle("16.04.2025\nfriday's schedule", { exact: true })).toContainClass('text-bg-warning');
    await expect(page1.getByTitle('3.04.2025', { exact: true })).not.toContainClass('text-bg-warning');
    await expect(page1.getByTitle('3.04.2025', { exact: true })).not.toContainClass('text-bg-info');

    await page1.getByTitle('3.04.2025', { exact: true }).click();

    await expect(page1.getByTitle('3.04.2025', { exact: true })).toContainClass('text-bg-info');

    await expect(page1.getByRole('textbox', { name: 'From' })).toHaveValue('2025-04-03');
    await expect(page1.getByRole('textbox', { name: 'To' })).toHaveValue('2025-04-03');
    await expect(page1.getByRole('combobox')).toHaveValue('no changes');
    await page1.getByRole('combobox').selectOption('tuesday');
    await page1.getByRole('button', { name: 'Set' }).click();

    await expect(page1.getByTitle("3.04.2025\ntuesday's schedule", { exact: true })).toBeVisible();
    await expect(page1.getByTitle("3.04.2025\ntuesday's schedule", { exact: true })).toHaveText('3');
    await expect(page1.getByTitle("3.04.2025\ntuesday's schedule", { exact: true })).toContainClass('text-bg-warning');

    await expect(page1.getByText('Saved!')).not.toBeVisible();
    await page1.getByRole('button', { name: 'Save' }).click();
    await expect(page1.getByText('Saved!')).toBeVisible();

    await page1.getByTitle('21.05.2025').click();
    await expect(page1.getByText('Saved!')).toBeVisible();

    await page1.getByRole('combobox').selectOption('holiday');
    await page1.getByRole('button', { name: 'Set' }).click();
    await expect(page1.getByText('Saved!')).not.toBeVisible();
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot edit schedule changes', async ({ page }) => {
        await page.goto('/semesters/2024-summer/schedule-changes/');

        const response = await page.request.put(
            '/api/semesters/094f8324-7c58-4566-b5d7-e4fe8ed03a18/schedule-changes/',
            {
                data: [],
            },
        );

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit schedule changes', async ({ page }) => {
        await page.goto('/semesters/2024-summer/schedule-changes/');
        await loginAsTeacher(page);

        const response = await page.request.put(
            '/api/semesters/094f8324-7c58-4566-b5d7-e4fe8ed03a18/schedule-changes/',
            {
                data: [],
            },
        );

        expect(response.status()).toBe(200);
    });
});
