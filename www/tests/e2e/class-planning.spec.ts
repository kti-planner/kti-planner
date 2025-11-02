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

test('Cannot plan classes when there are conflicts', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v//');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('4A');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-10-01');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');

    await expect(page.getByText('2025-10-01 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-10-15 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-10-29 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-11-19 11:15 - 13:00')).toBeVisible();

    await page.getByRole('button', { name: 'Generate classes' }).click();

    await expect(page.getByText('There are conflicts with holidays or other events')).toBeVisible();
});

test('Cannot plan classes when there are holidays', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v//');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('4A');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-10-31');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');

    await expect(page.getByText('2025-10-31 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-11-14 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-11-28 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-12-12 11:15 - 13:00')).toBeVisible();

    await page.getByRole('button', { name: 'Generate classes' }).click();

    await expect(page.getByText('There are conflicts with holidays or other events')).toBeVisible();
    await expect(page.getByText('This is a holiday')).toBeVisible();
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

test('Can plan classes with two weeks between each one', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Plan classes' }).click();
    await page.getByRole('combobox', { name: 'Laboratory group' }).selectOption('5A');
    await page.getByRole('textbox', { name: 'First class date' }).fill('2025-03-25');
    await page.getByRole('textbox', { name: 'Class start time' }).fill('11:15');
    await page.getByRole('textbox', { name: 'Class end time' }).fill('13:00');
    await page.getByRole('spinbutton', { name: 'How many weeks are between classes?' }).fill('2');

    await expect(page.getByText('2025-03-25 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-08 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-04-29 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-13 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-05-27 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('2025-06-10 11:15 - 13:00')).toBeVisible();

    await page.getByRole('button', { name: 'Generate classes' }).click();

    await expect(page.getByText('9 – 15 Jun 2025')).toBeVisible();
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

    await page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Class details' })).toBeVisible();

    await expect(page.locator('.modal').getByRole('link', { name: '1. Diagnostyka sieci IPv4' })).toBeVisible();

    await expect(page.getByText('Laboratory group: 1A')).toBeVisible();
    await expect(page.getByText('Classroom: EA 142')).toBeVisible();
    await expect(page.getByText('Date: 1.10.2025 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('Teacher: Jan Kowalski')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Save' })).not.toBeVisible();
});

test('Can edit class time when logged in', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsTeacher(page);

    await page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();

    await expect(page.locator('.modal').getByRole('link', { name: '1. Diagnostyka sieci IPv4' })).toBeVisible();
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

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' })).not.toBeVisible();
    await expect(page.locator('.calendar-wrapper a').filter({ hasText: '13:15 - 15:00' })).toBeVisible();
});

test('Cannot edit class time to another class', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsTeacher(page);

    await page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();

    await expect(page.locator('.modal').getByRole('link', { name: '1. Diagnostyka sieci IPv4' })).toBeVisible();
    await expect(page.getByText('Laboratory group: 1A')).toBeVisible();
    await expect(page.getByText('Classroom: EA 142')).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-01');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('11:15');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('13:00');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Teacher' }), 'Jan Kowalski');

    await page.getByRole('textbox', { name: 'Date' }).fill('2025-10-03');
    await page.getByRole('textbox', { name: 'Start time' }).fill('09:15');
    await page.getByRole('textbox', { name: 'End time' }).fill('11:00');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('There is another class during this time')).toBeVisible();
});

test('Can move classes forwards', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsTeacher(page);

    await page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();

    await expect(page.locator('.modal').getByRole('link', { name: '1. Diagnostyka sieci IPv4' })).toBeVisible();
    await expect(page.getByText('Laboratory group: 1A')).toBeVisible();
    await expect(page.getByText('Classroom: EA 142')).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-01');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('11:15');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('13:00');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Teacher' }), 'Jan Kowalski');

    await page.getByRole('button', { name: 'Moving classes' }).click();
    await page.getByRole('button', { name: 'Move' }).click();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' })).not.toBeVisible();

    const nextWeekBtn = page.getByRole('button', { name: 'Next week' });
    await nextWeekBtn.click();

    await expect(page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' })).toBeVisible();
});

test('Cannot move classes outside of semester', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsTeacher(page);

    await page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' }).click();

    await expect(page.getByRole('heading', { name: 'Edit class' })).toBeVisible();

    await expect(page.locator('.modal').getByRole('link', { name: '1. Diagnostyka sieci IPv4' })).toBeVisible();
    await expect(page.getByText('Laboratory group: 1A')).toBeVisible();
    await expect(page.getByText('Classroom: EA 142')).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-01');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('11:15');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('13:00');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Teacher' }), 'Jan Kowalski');

    await page.getByRole('button', { name: 'Moving classes' }).click();
    await page.getByRole('combobox', { name: 'Move by direction' }).selectOption('backwards');
    await page.getByRole('button', { name: 'Move' }).click();

    await expect(page.getByText('2025-09-24: Outside of semester')).toBeVisible();
});
