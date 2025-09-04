import { expect } from 'playwright/test';
import { loginAsAdmin, test } from './fixtures';

test('Can view and select groups', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');

    await expect(page.locator('label').filter({ hasText: 'inf1a' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'inf1b' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'inf2a' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'inf2b' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'inf3a' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'inf3b' })).toBeVisible();

    await expect(page.locator('label').filter({ hasText: 'inf1a' })).not.toContainClass('btn-success');
    await expect(page.locator('label').filter({ hasText: 'inf1b' })).not.toContainClass('btn-success');
    await page.locator('label').filter({ hasText: 'inf1a' }).click();
    await expect(page.locator('label').filter({ hasText: 'inf1a' })).toContainClass('btn-success');
    await page.locator('label').filter({ hasText: 'inf1b' }).click();
    await expect(page.locator('label').filter({ hasText: 'inf1b' })).toContainClass('btn-success');
    await page.locator('label').filter({ hasText: 'inf1a' }).click();
    await expect(page.locator('label').filter({ hasText: 'inf1a' })).not.toContainClass('btn-success');
    await page.locator('label').filter({ hasText: 'inf1b' }).click();
    await expect(page.locator('label').filter({ hasText: 'inf1b' })).not.toContainClass('btn-success');

    await expect(page.getByRole('button', { name: 'Edit groups' })).not.toBeVisible();
});

test('Can add groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.getByRole('button', { name: 'Add new laboratory group' }).click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('label', { hasText: 'inf4a' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.getByRole('button', { name: 'Add new laboratory group' }).click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText('A group with this name already exists')).toBeVisible();
});

test('Can edit groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');
    await loginAsAdmin(page);

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.locator('.list-group-item', { hasText: 'inf1a' }).hover();
    await page.locator('.list-group-item', { hasText: 'inf1a' }).locator('button').click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('label', { hasText: 'inf1a' })).not.toBeVisible();
    await expect(page.locator('label', { hasText: 'inf4a' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.locator('.list-group-item', { hasText: 'inf2a' }).hover();
    await page.locator('.list-group-item', { hasText: 'inf2a' }).locator('button').click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('A group with this name already exists')).toBeVisible();
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new laboratory group', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');

        const response = await page.request.post(
            '/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/api/laboratory-groups/',
            {
                data: {
                    name: 'Test Group',
                },
            },
        );

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new laboratory group', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');
        await loginAsAdmin(page);

        const response = await page.request.post(
            '/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/api/laboratory-groups/',
            {
                data: {
                    name: 'Test Group',
                },
            },
        );

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit laboratory group', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');

        const response = await page.request.patch(
            '/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/api/laboratory-groups/',
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
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/');
        await loginAsAdmin(page);

        const response = await page.request.patch(
            '/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe/api/laboratory-groups/',
            {
                data: {
                    id: 'bb9309c2-6a67-4f65-bcc9-fa9547d9ffe9',
                    name: 'Updated Group',
                },
            },
        );

        expect(response.status()).toBe(200);
    });
});
