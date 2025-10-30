import { expect } from 'playwright/test';
import { loginAsAdmin, loginAsTeacher, test } from './fixtures';

test('Cannot access classrooms list when logged-out', async ({ page }) => {
    await page.goto('/classrooms/');
    await expect(page).toHaveURL('/login/?next=%2Fclassrooms%2F');
});

test('Can access classrooms list when logged-in', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Add new exercise' }).click();
    await page.getByRole('link', { name: 'Manage classrooms' }).click();

    await expect(page.locator('body')).toContainText('EA 142');
    await expect(page.locator('body')).toContainText('EA 204');
});

test('Can add new classroom and prevent duplicate classroom creation', async ({ page }) => {
    await page.goto('/classrooms/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Add new classroom' }).click();

    await expect(page.getByRole('heading', { name: 'Add new classroom' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Classroom name' }).fill('EA 250');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('body')).toContainText('EA 250');

    // Cannot add duplicate
    await page.getByRole('button', { name: 'Add new classroom' }).click();

    await expect(page.getByRole('heading', { name: 'Add new classroom' })).toBeVisible();

    // Existing name
    await page.getByRole('textbox', { name: 'Classroom name' }).fill('EA 250');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Classroom with this name already exists')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new classroom' })).toBeVisible();
    await expect(page.locator('body')).toContainText('EA 142');
    await expect(page.locator('body')).toContainText('EA 204');
    await expect(page.locator('body')).toContainText('EA 250');
});

test('Can edit classroom and prevent duplicate classroom', async ({ page }) => {
    await page.goto('/classrooms/');
    await loginAsAdmin(page);

    await page.locator('.list-group-item', { hasText: 'EA 142' }).hover();
    await page.locator('.list-group-item', { hasText: 'EA 142' }).locator('button').click();

    await page.getByRole('textbox', { name: 'Classroom name' }).fill('EA 143');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(page.locator('body')).toContainText('EA 143');

    // Cannot add duplicate
    await page.locator('.list-group-item', { hasText: 'EA 204' }).hover();
    await page.locator('.list-group-item', { hasText: 'EA 204' }).locator('button').click();

    // Existing name
    await page.getByRole('textbox', { name: 'Classroom name' }).fill('EA 143');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(page.getByLabel('Edit classroom EA 204').locator('form')).toContainText(
        'Classroom with this name already exists',
    );

    await page.getByRole('button', { name: 'Close' }).click();
});

test('Can delete subject', async ({ page }) => {
    await page.goto('/classrooms/');
    await loginAsTeacher(page);

    await page.locator('.list-group-item', { hasText: 'EA 142' }).hover();
    await page.locator('.list-group-item', { hasText: 'EA 142' }).locator('button').click();
    await page.getByRole('button', { name: 'Delete classroom' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();

    await page.waitForURL('/semesters/2024-summer/');

    await expect(
        page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }),
    ).not.toBeVisible();
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new classroom', async ({ page }) => {
        await page.goto('/classrooms/');

        const response = await page.request.post('/classrooms/api/', {
            data: {
                name: 'Test classroom',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new classroom', async ({ page }) => {
        await page.goto('/classrooms/');
        await loginAsAdmin(page);

        const response = await page.request.post('/classrooms/api/', {
            data: {
                name: 'Test Classroom',
            },
        });

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit classroom', async ({ page }) => {
        await page.goto('/classrooms/');

        const response = await page.request.patch('/classrooms/api/', {
            data: {
                id: '8689d55d-508e-4f5d-aef8-d5052f220d20',
                name: 'Updated Classroom',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit classroom', async ({ page }) => {
        await page.goto('/classrooms/');
        await loginAsAdmin(page);

        const response = await page.request.patch('/classrooms/api/', {
            data: {
                id: '8689d55d-508e-4f5d-aef8-d5052f220d20',
                name: 'Updated Classroom',
            },
        });

        expect(response.status()).toBe(200);
    });

    test('Logged-out user cannot delete classroom', async ({ page }) => {
        await page.goto('/classrooms/');

        const response = await page.request.delete('/classrooms/api/', {
            data: null,
            params: {
                id: '8689d55d-508e-4f5d-aef8-d5052f220d20',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can delete classroom', async ({ page }) => {
        await page.goto('/classrooms/');
        await loginAsAdmin(page);

        const response = await page.request.delete('/classrooms/api/', {
            data: null,
            params: {
                id: '8689d55d-508e-4f5d-aef8-d5052f220d20',
            },
        });

        expect(response.status()).toBe(200);
    });
});
