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
        page.locator('.modal').getByRole('link', {
            name: 'Sieci komputerowe - Informatyka sem. V Full-time first-cycle studies',
            exact: true,
        }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: '1. Diagnostyka sieci IPv4', exact: true })).toBeVisible();
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
        page.locator('.modal').getByRole('link', {
            name: 'Sieci komputerowe - Informatyka sem. V Full-time first-cycle studies',
            exact: true,
        }),
    ).toBeVisible();

    await expect(page.getByRole('link', { name: '1. Diagnostyka sieci IPv4', exact: true })).toBeVisible();
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

test('Can view calendar event details', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page
        .locator('.calendar-wrapper a')
        .filter({ hasText: '11:15 - 13:00' })
        .filter({ hasText: 'Koło naukowe' })
        .click();

    await expect(page.getByRole('heading', { name: 'Event details' })).toBeVisible();

    await expect(page.getByText('Date: 2.10.2025 11:15 - 13:00')).toBeVisible();
    await expect(page.getByText('Name: Koło naukowe')).toBeVisible();
    await expect(page.getByText('Teacher: Bogdan Nowak')).toBeVisible();
    await expect(page.getByText('Classroom: EA 204')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Save' })).not.toBeVisible();
});

test('Can create single calendar event', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page.locator('.fc-timegrid-slot-lane[data-time="14:00:00"]').click();

    await expect(page.getByRole('heading', { name: 'Add event' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-02');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('14:00');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('15:00');

    await page.getByRole('textbox', { name: 'Name' }).fill('Test event');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 204');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '14:00 - 15:00' }).filter({ hasText: 'Test event' }),
    ).toBeVisible();
});

test('Add event button is hidden for logged-out users', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await expect(page.getByRole('button', { name: 'Add event' })).toHaveCount(0);
});

test('Add event button is visible for logged-in users', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await expect(page.getByRole('button', { name: 'Add event' })).toBeVisible();
});

test('Can create single calendar event from button', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Add event' }).click();

    await expect(page.getByRole('heading', { name: 'Add event' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Date' }).fill('2025-10-02');
    await page.getByRole('textbox', { name: 'Start time' }).fill('14:00');
    await page.getByRole('textbox', { name: 'End time' }).fill('15:00');
    await page.getByRole('textbox', { name: 'Name' }).fill('Test event');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 204');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '14:00 - 15:00' }).filter({ hasText: 'Test event' }),
    ).toBeVisible();
});

test('Can create repeating calendar event', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page.locator('.fc-timegrid-slot-lane[data-time="14:00:00"]').click();

    await expect(page.getByRole('heading', { name: 'Add event' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-02');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('14:00');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('15:00');

    await page.getByRole('checkbox', { name: 'Repeats' }).check();
    await page.getByRole('spinbutton', { name: 'Repeats every' }).fill('2');
    await page.getByRole('combobox', { name: 'Ends' }).selectOption('Before the semester ends');
    await page.getByRole('spinbutton', { name: 'Repeat amount' }).fill('2');
    await expect(page.getByRole('textbox', { name: 'Last event' })).toHaveValue('2025-10-16');

    await page.getByRole('textbox', { name: 'Name' }).fill('Test event');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 204');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '14:00 - 15:00' }).filter({ hasText: 'Test event' }),
    ).toBeVisible();

    const nextWeekBtn = page.getByRole('button', { name: 'Next week' });
    await nextWeekBtn.click();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '14:00 - 15:00' }).filter({ hasText: 'Test event' }),
    ).not.toBeVisible();

    await nextWeekBtn.click();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '14:00 - 15:00' }).filter({ hasText: 'Test event' }),
    ).toBeVisible();
});

test('Cannot create event during another event', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page.locator('.fc-timegrid-slot-lane[data-time="14:00:00"]').click();

    await expect(page.getByRole('heading', { name: 'Add event' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-02');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('14:00');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('15:00');

    await page.getByRole('textbox', { name: 'Date' }).fill('2025-10-03');
    await page.getByRole('textbox', { name: 'Start time' }).fill('09:15');
    await page.getByRole('textbox', { name: 'End time' }).fill('11:00');
    await page.getByRole('textbox', { name: 'Name' }).fill('Test event');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('2025-10-03: Another class takes place in this classroom')).toBeVisible();
});

test('Can edit calendar event when logged in', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page
        .locator('.calendar-wrapper a')
        .filter({ hasText: '11:15 - 13:00' })
        .filter({ hasText: 'Koło naukowe' })
        .click();

    await expect(page.getByRole('heading', { name: 'Edit event' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-02');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('11:15');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('13:00');
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Koło naukowe');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Teacher' }), 'Bogdan Nowak');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Classroom' }), 'EA 204');

    await page.getByRole('textbox', { name: 'Date' }).fill('2025-10-03');
    await page.getByRole('textbox', { name: 'Start time' }).fill('12:15');
    await page.getByRole('textbox', { name: 'End time' }).fill('14:00');
    await page.getByRole('textbox', { name: 'Name' }).fill('Koło naukowe 2');
    await page.getByRole('combobox', { name: 'Teacher' }).selectOption('Admin');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '11:15 - 13:00' }).filter({ hasText: 'Koło naukowe' }),
    ).not.toBeVisible();

    await expect(
        page.locator('.calendar-wrapper a').filter({ hasText: '12:15 - 14:00' }).filter({ hasText: 'Koło naukowe 2' }),
    ).toBeVisible();
});

test('Cannot reschedule calendar event to another event', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsTeacher(page);

    await page
        .locator('.calendar-wrapper a')
        .filter({ hasText: '11:15 - 13:00' })
        .filter({ hasText: 'Koło naukowe' })
        .click();

    await expect(page.getByRole('heading', { name: 'Edit event' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue('2025-10-02');
    await expect(page.getByRole('textbox', { name: 'Start time' })).toHaveValue('11:15');
    await expect(page.getByRole('textbox', { name: 'End time' })).toHaveValue('13:00');
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Koło naukowe');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Teacher' }), 'Bogdan Nowak');
    await expectSelectedOptionText(page.getByRole('combobox', { name: 'Classroom' }), 'EA 204');

    await page.getByRole('textbox', { name: 'Date' }).fill('2025-10-01');
    await page.getByRole('textbox', { name: 'Start time' }).fill('09:15');
    await page.getByRole('textbox', { name: 'End time' }).fill('11:00');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('2025-10-01: Another class takes place in this classroom')).toBeVisible();
});
