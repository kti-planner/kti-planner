import { expect } from 'playwright/test';
import { loginAsAdmin, test } from './fixtures';

test('Cannot access classrooms list when logged-out', async ({ page }) => {
    await page.goto('/classrooms/');
    await expect(page).toHaveURL('/login/?next=%2Fclassrooms%2F');
});

test('Can access classrooms list when logged-in', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Add new exercise' }).click();
    await page.getByRole('link', { name: 'Manage classrooms' }).click();

    await expect(page.locator('body')).toContainText('EA 142');
    await expect(page.locator('body')).toContainText('EA 204');
    await expect(page.locator('body')).toContainText('Zdalnie');
});

test('Can add new classroom and prevent duplicate classroom creation', async ({ page }) => {
    await page.goto('/classrooms/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Add new classroom' }).click();

    await expect(page.locator('#classroom-modal')).toBeVisible();
    await expect(page.locator('#classroom-modal')).toContainText('Add new classroom');

    await page.locator('#classroom-modal').locator('#classroomName').fill('EA 250');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('body')).toContainText('EA 250');

    // Cannot add duplicate
    await page.getByRole('button', { name: 'Add new classroom' }).click();

    await expect(page.locator('#classroom-modal')).toBeVisible();
    await expect(page.locator('#classroom-modal')).toContainText('Add new classroom');

    // Existing name
    await page.locator('#classroom-modal').locator('#classroomName').fill('EA 250');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('#classroom-modal').locator('form')).toContainText(
        'Classroom with this name already exists',
    );

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new classroom' })).toBeVisible();
    await expect(page.locator('body')).toContainText('EA 142');
    await expect(page.locator('body')).toContainText('EA 204');
    await expect(page.locator('body')).toContainText('EA 250');
    await expect(page.locator('body')).toContainText('Zdalnie');
});

test('Can edit classroom and prevent duplicate classroom', async ({ page }) => {
    await page.goto('/classrooms/');
    await loginAsAdmin(page);

    await page.locator('.list-group-item', { hasText: 'EA 142' }).hover();
    await page.locator('.list-group-item', { hasText: 'EA 142' }).locator('button').click();

    await page.getByLabel('Edit classroom EA 142').locator('#classroomName').fill('EA 143');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(page.locator('body')).toContainText('EA 143');

    // Cannot add duplicate
    await page.locator('.list-group-item', { hasText: 'EA 204' }).hover();
    await page.locator('.list-group-item', { hasText: 'EA 204' }).locator('button').click();

    // Existing name
    await page.getByLabel('Edit classroom EA 204').locator('#classroomName').fill('EA 143');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(page.getByLabel('Edit classroom EA 204').locator('form')).toContainText(
        'Classroom with this name already exists',
    );

    await page.getByRole('button', { name: 'Close' }).click();
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new classroom', async ({ page }) => {
        await page.goto('/classrooms/');

        const response = await page.request.post('/classroms/api/', {
            data: {
                name: 'Test classrom',
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
});
