import { expect } from 'playwright/test';
import { loginAsAdmin, test } from './fixtures';

test('Can view and select groups', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');

    await expect(page.locator('label').filter({ hasText: '1A' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '1B' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '2A' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '2B' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '3A' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '3B' })).toBeVisible();

    await expect(page.locator('label').filter({ hasText: '1A' })).not.toContainClass('btn-success');
    await expect(page.locator('label').filter({ hasText: '1B' })).not.toContainClass('btn-success');
    await page.locator('label').filter({ hasText: '1A' }).click();
    await expect(page.locator('label').filter({ hasText: '1A' })).toContainClass('btn-success');
    await page.locator('label').filter({ hasText: '1B' }).click();
    await expect(page.locator('label').filter({ hasText: '1B' })).toContainClass('btn-success');
    await page.locator('label').filter({ hasText: '1A' }).click();
    await expect(page.locator('label').filter({ hasText: '1A' })).not.toContainClass('btn-success');
    await page.locator('label').filter({ hasText: '1B' }).click();
    await expect(page.locator('label').filter({ hasText: '1B' })).not.toContainClass('btn-success');

    await expect(page.getByRole('button', { name: 'Edit groups' })).not.toBeVisible();
});

test('Can add groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.getByRole('button', { name: 'Add new laboratory group' }).click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('7A');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('label', { hasText: '7A' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.getByRole('button', { name: 'Add new laboratory group' }).click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('7A');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText('A group with this name already exists')).toBeVisible();
});

test('Can edit groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.locator('.list-group-item', { hasText: '1A' }).hover();
    await page.locator('.list-group-item', { hasText: '1A' }).locator('button').click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('7A');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('label', { hasText: '1A' })).not.toBeVisible();
    await expect(page.locator('label', { hasText: '7A' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.locator('.list-group-item', { hasText: '2A' }).hover();
    await page.locator('.list-group-item', { hasText: '2A' }).locator('button').click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('7A');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('A group with this name already exists')).toBeVisible();
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new laboratory group', async ({ page }) => {
        await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');

        const response = await page.request.post(
            '/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/api/laboratory-groups/',
            {
                data: {
                    name: 'Test Group',
                },
            },
        );

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new laboratory group', async ({ page }) => {
        await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
        await loginAsAdmin(page);

        const response = await page.request.post(
            '/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/api/laboratory-groups/',
            {
                data: {
                    name: 'Test Group',
                },
            },
        );

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit laboratory group', async ({ page }) => {
        await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');

        const response = await page.request.patch(
            '/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/api/laboratory-groups/',
            {
                data: {
                    id: 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9',
                    name: 'Updated Group',
                },
            },
        );

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit laboratory group', async ({ page }) => {
        await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
        await loginAsAdmin(page);

        const response = await page.request.patch(
            '/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/api/laboratory-groups/',
            {
                data: {
                    id: 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9',
                    name: 'Updated Group',
                },
            },
        );

        expect(response.status()).toBe(200);
    });

    test('Logged-out user cannot delete laboratory group', async ({ page }) => {
        await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');

        const response = await page.request.delete(
            '/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/api/laboratory-groups/',
            {
                data: null,
                params: {
                    id: 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9',
                },
            },
        );

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can delete laboratory group', async ({ page }) => {
        await page.goto('/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
        await loginAsAdmin(page);

        const response = await page.request.delete(
            '/semesters/2025-winter/subjects/sieci-komputerowe---informatyka-sem.-v/api/laboratory-groups/',
            {
                data: null,
                params: {
                    id: 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9',
                },
            },
        );

        expect(response.status()).toBe(200);
    });
});
