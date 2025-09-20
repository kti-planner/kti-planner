import { expect } from 'playwright/test';
import { expectSelectedOptionText, loginAsTeacher, test } from './fixtures';

test('Cannot plan classes when not logged in', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await expect(page.getByRole('button', { name: 'Plan classes' })).not.toBeVisible();
});

test('Can plan classes without selecting a group beforehand', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('5A');
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
    await expect(page.locator('p', { hasText: '11:15 - 13:00' })).toBeVisible();
});

test('Can plan classes with a group selected beforehand', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsTeacher(page);

    await page.locator('label', { hasText: '5A' }).click();
    await page.getByRole('button', { name: 'Plan classes' }).click();

    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Laboratory group' }), '5A');
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
    await expect(page.locator('p', { hasText: '11:15 - 13:00' })).toBeVisible();
});

test('Cannot generate classes starting at a holiday', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('5A');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-04-18');
    await expect(page.getByText('The date you selected is a holiday')).toBeVisible();
});

test('Can plan classes with two weeks between each one', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('5A');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-04-08');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');
    await page.getByRole('spinbutton', { name: 'How many weeks are between classes?' }).fill('2');

    await expect(page.getByText('2025-04-08 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-29 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-13 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-27 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-06-10 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-06-24 11:15 - 13:00')).toBeVisible();

    await page.getByRole('button', { name: 'Generate classes' }).click();

    await expect(page.getByText('23 – 29 Jun 2025')).toBeVisible();
    await expect(page.locator('p', { hasText: '11:15 - 13:00' })).toBeVisible();
});

test('Generating classes that extend beyond semester end results in a warning', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('5A');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-06-04');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');
    await expect(page.getByText('The classes do not fit in the semester')).toBeVisible();
});

test('Cannot edit classes when not logged in', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await page.getByRole('gridcell', { name: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Class details' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save' })).not.toBeVisible();
});

test('Can edit class time when logged in', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsTeacher(page);

    await page.getByRole('gridcell', { name: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Start date' }).fill('2025-10-01T13:15');
    await page.getByRole('textbox', { name: 'End date' }).fill('2025-10-01T15:00');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('gridcell', { name: '11:15 - 13:00' })).not.toBeVisible();
    await expect(page.getByRole('gridcell', { name: '13:15 - 15:00' })).toBeVisible();
});
