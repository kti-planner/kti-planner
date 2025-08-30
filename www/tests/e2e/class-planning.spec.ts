import { expect } from 'playwright/test';
import { expectSelectedOptionText, loginAsTeacher, test } from './fixtures';

test('Cannot plan classes when not logged in', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await expect(page.getByRole('button', { name: 'Plan classes' })).not.toBeVisible();
});

test('Can plan classes without selecting a group beforehand', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('inf1a');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-04-08');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');

    await expect(page.getByText('2025-04-08 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-15 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-29 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-06 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-13 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-20 11:15 - 13:00')).toBeVisible();

    await page.getByRole('button', { name: 'Generate classes' }).click();

    await expect(page.getByText('19 – 25 May 2025')).toBeVisible();
    await expect(page.getByText('11:15 - 13:00')).toBeVisible();
});

test('Can plan classes with a group selected beforehand', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await loginAsTeacher(page);

    await page.locator('label', { hasText: 'inf1a' }).click();
    await page.getByRole('button', { name: 'Plan classes' }).click();

    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Laboratory group' }), 'inf1a');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-04-08');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');

    await expect(page.getByText('2025-04-08 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-15 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-29 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-06 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-13 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-20 11:15 - 13:00')).toBeVisible();

    await page.getByRole('button', { name: 'Generate classes' }).click();

    await expect(page.getByText('19 – 25 May 2025')).toBeVisible();
    await expect(page.getByText('11:15 - 13:00')).toBeVisible();
});

test('Cannot generate classes starting at a holiday', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('inf1a');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-04-18');
    await expect(page.getByText('The date you selected is a holiday')).toBeVisible();
});
