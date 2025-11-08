import { expect } from 'playwright/test';
import { test } from 'tests/e2e/fixtures';
import z from 'zod';

test('Calendar filters carry over to export modal', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page.locator('label', { hasText: 'Sieci komputerowe - Informatyka sem. V' }).click();
    await page.locator('label', { hasText: 'EA 142' }).click();
    await page.locator('label', { hasText: 'Bogdan Nowak' }).click();

    await page.getByRole('button', { name: 'Export calendar' }).click();

    const exportModal = page.locator('.modal');
    await exportModal.getByRole('button', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();
    await expect(exportModal.getByRole('switch', { name: 'Export this subject' })).toBeChecked();
    await expect(exportModal.locator('label', { hasText: 'EA 142' })).toContainClass('btn-success');
    await expect(exportModal.locator('label', { hasText: 'Bogdan Nowak' })).toContainClass('btn-success');
});

test('Can get iCalendar URL without filters', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page.getByRole('button', { name: 'Export calendar' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        `${page.url()}api/ics/?exportCalendarEvents=true&lang=en`,
    );
});

const uuidRegexStr = z.regexes.uuid4.source.slice(1, z.regexes.uuid4.source.length - 1);

test('Can use subject and group filters when exporting calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page.getByRole('button', { name: 'Export calendar' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        `${page.url()}api/ics/?exportCalendarEvents=true&lang=en`,
    );

    const exportModal = page.locator('.modal');
    await exportModal.getByRole('button', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();
    await exportModal.getByRole('switch', { name: 'Export this subject' }).check();
    await exportModal.locator('label', { hasText: '1A' }).first().click();
    await exportModal.getByRole('button', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        new RegExp(
            `^${`${page.url()}api/ics/`.replaceAll('/', '\\/')}\\?subject=${uuidRegexStr}&laboratoryGroup=${uuidRegexStr}&exportCalendarEvents=true&lang=en`,
        ),
    );

    await exportModal.getByRole('button', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();
    await exportModal.getByRole('switch', { name: 'Export this subject' }).uncheck();
    await exportModal.locator('label', { hasText: '1A' }).first().click();
    await exportModal.getByRole('button', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        `${page.url()}api/ics/?exportCalendarEvents=true&lang=en`,
    );
});

test('Can use classroom and teacher filters when exporting calendar', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page.getByRole('button', { name: 'Export calendar' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        `${page.url()}api/ics/?exportCalendarEvents=true&lang=en`,
    );

    const exportModal = page.locator('.modal');
    await exportModal.locator('label', { hasText: 'EA 142' }).click();
    await exportModal.locator('label', { hasText: 'EA 204' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        new RegExp(
            `^${`${page.url()}api/ics/`.replaceAll('/', '\\/')}\\?classroom=${uuidRegexStr}&classroom=${uuidRegexStr}&exportCalendarEvents=true&lang=en`,
        ),
    );

    await exportModal.locator('label', { hasText: 'Jan Kowalski' }).click();
    await exportModal.locator('label', { hasText: 'Bogdan Nowak' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        new RegExp(
            `^${`${page.url()}api/ics/`.replaceAll('/', '\\/')}\\?classroom=${uuidRegexStr}&classroom=${uuidRegexStr}&teacher=${uuidRegexStr}&teacher=${uuidRegexStr}&exportCalendarEvents=true&lang=en`,
        ),
    );

    await exportModal.locator('label', { hasText: 'Bogdan Nowak' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        new RegExp(
            `^${`${page.url()}api/ics/`.replaceAll('/', '\\/')}\\?classroom=${uuidRegexStr}&classroom=${uuidRegexStr}&teacher=${uuidRegexStr}&exportCalendarEvents=true&lang=en`,
        ),
    );
});

test('Can export with or without calendar events', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');

    await page.getByRole('button', { name: 'Export calendar' }).click();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        `${page.url()}api/ics/?exportCalendarEvents=true&lang=en`,
    );

    await page.getByRole('switch', { name: 'Export events outside of subjects' }).uncheck();

    await expect(page.getByRole('textbox', { name: 'iCalendar/WebCal link' })).toHaveValue(
        `${page.url()}api/ics/?lang=en`,
    );
});
