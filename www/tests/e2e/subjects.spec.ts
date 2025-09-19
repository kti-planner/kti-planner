import { expect } from 'playwright/test';
import { loginAsAdmin, test } from './fixtures';

test('Can access subject list', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await expect(page.locator('body')).toContainText('Lokalne sieci bezprzewodowe');
    await expect(page.locator('body')).toContainText('Zarządzanie bezpieczeństwem sieci');
});

test('Can access subject page', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe' }).click();
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe');
});

test('Add new subject button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await expect(page.getByRole('button', { name: 'Add new subject' })).toHaveCount(0);
});

test('Add new subject button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await expect(page.getByRole('button', { name: 'Add new subject' })).toBeVisible();
});

test('Can add new subject and prevent duplicate subject creation', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');
    await loginAsAdmin(page);

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await page.getByRole('button', { name: 'Add new subject' }).click();

    await expect(page.getByRole('heading', { name: 'Add new subject' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Sieci komputerowe');
    await page.getByRole('combobox', { name: 'Teachers' }).selectOption('Jan Kowalski');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Sieci komputerowe');

    await page.goto('/semesters/2024-summer/');
    await expect(page.getByRole('link', { name: 'Sieci komputerowe' })).toBeVisible();

    // Cannot add duplicate subject
    await page.goto('/semesters/2024-summer/');

    await page.getByRole('button', { name: 'Add new subject' }).click();

    await expect(page.getByRole('heading', { name: 'Add new subject' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Sieci komputerowe');
    await page.getByRole('combobox', { name: 'Teachers' }).selectOption('Jan Kowalski');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Subject with this name already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new subject' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sieci komputerowe' })).toHaveCount(1);
});

test('Edit subject button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');

    await expect(page.getByRole('button', { name: 'Edit subject' })).toHaveCount(0);
});

test('Edit subject button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe' }).click();
    await page.waitForURL('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe');

    await expect(page.getByRole('button', { name: 'Edit subject' })).toBeVisible();
});

test('Can edit subject and prevent duplicate subject', async ({ page }) => {
    // Can edit subject with data that do not match already existing subject
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe');

    await expect(page.getByRole('button', { name: 'Edit subject' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit subject' }).click();

    await expect(page.getByRole('heading', { name: 'Edit subject Lokalne sieci bezprzewodowe' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Sieci Ethernet i IP');
    await page.getByRole('combobox', { name: 'Teachers' }).selectOption('Admin');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Sieci Ethernet i IP');
    await expect(page.locator('body')).toContainText('Sieci Ethernet i IP');

    // Can not edit subject with data that match already existing subject
    await page.getByRole('button', { name: 'Edit subject' }).click();

    await expect(page.getByRole('heading', { name: 'Edit subject Sieci Ethernet i IP' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Zarządzanie bezpieczeństwem sieci');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Subject with this name already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Sieci Ethernet i IP');
    await expect(page.locator('body')).toContainText('Sieci Ethernet i IP');
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');

        const response = await page.request.post('/semesters/api/subjects/', {
            data: {
                name: 'New Subject',
                semesterId: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                teacherIds: ['c393c524-453c-4b02-bfad-5114fe828200'],
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');
        await loginAsAdmin(page);

        const response = await page.request.post('/semesters/api/subjects/', {
            data: {
                name: 'New Subject',
                semesterId: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                teacherIds: ['c393c524-453c-4b02-bfad-5114fe828200'],
            },
        });

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');

        const response = await page.request.patch('/semesters/api/subjects/', {
            data: {
                id: '3f58b671-5b38-43f8-bf0f-49d93048c52e',
                name: 'Updated Subject',
                teacherIds: ['feeaa186-3d69-4801-a580-88be10d53553'],
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');
        await loginAsAdmin(page);

        const response = await page.request.patch('/semesters/api/subjects/', {
            data: {
                id: '3f58b671-5b38-43f8-bf0f-49d93048c52e',
                name: 'Updated Subject',
                teacherIds: ['feeaa186-3d69-4801-a580-88be10d53553'],
            },
        });

        expect(response.status()).toBe(200);
    });
});
