import { expect } from 'playwright/test';
import { loginAsAdmin, loginAsTeacher, test } from './fixtures';

test('Can access semester list', async ({ page }) => {
    await page.goto('/semesters/');

    await expect(page.locator('body')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('Winter semester 2024/2025');
    await expect(page.locator('body')).toContainText('Summer semester 2023/2024');
    await expect(page.locator('body')).toContainText('Winter semester 2023/2024');
});

test('Can access semester page', async ({ page }) => {
    await page.goto('/semesters/');

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
});

test('Add new semester button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/');

    await expect(page.getByRole('button', { name: 'Add new semester' })).toHaveCount(0);
});

test('Add new semester button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
});

test('Can add new semester and prevent duplicate semester creation', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
    await page.getByRole('button', { name: 'Add new semester' }).click();

    await expect(page.getByRole('heading', { name: 'Add new semester' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('summer');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2100');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2100-02-21');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2100-06-14');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2100/2101');

    await page.goto('/semesters/');
    await expect(page.getByRole('link', { name: 'Summer semester 2100/2101' })).toBeVisible();

    // Cannot add duplicate semester
    await page.goto('/semesters/');

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
    await page.getByRole('button', { name: 'Add new semester' }).click();

    await expect(page.getByRole('heading', { name: 'Add new semester' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('summer');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2100');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2100-02-21');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2100-06-14');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Semester with this year and type already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Summer semester 2100/2101' })).toHaveCount(1);
});

test('Edit semester button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/');

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await expect(page.getByRole('button', { name: 'Edit semester' })).toHaveCount(0);
});

test('Edit semester button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await expect(page.getByRole('button', { name: 'Edit semester' })).toBeVisible();
});

test('Can edit semester and prevent duplicate semester', async ({ page }) => {
    // Can edit semester with data that do not match already existing semester
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('24.02.2025 - 15.06.2025');

    await expect(page.getByRole('button', { name: 'Edit semester' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit semester' }).click();

    await expect(page.getByRole('heading', { name: 'Edit semester 2024/2025' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('winter');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2069');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2069-10-01');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2070-02-15');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2069/2070');
    await expect(page.locator('body')).toContainText('1.10.2069 - 15.02.2070');

    // Can not edit semester with data that match already existing semester
    await page.getByRole('button', { name: 'Edit semester' }).click();

    await expect(page.getByRole('heading', { name: 'Edit semester 2069/2070' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('winter');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2023');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2023-10-01');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2023-02-15');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Semester with this year and type already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2069/2070');
    await expect(page.locator('body')).toContainText('1.10.2069 - 15.02.2070');
});

test('Can delete empty semester', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsTeacher(page);

    await page.getByRole('link', { name: 'Winter semester 2023/2024' }).click();
    await page.getByRole('button', { name: 'Edit semester' }).click();
    await page.getByRole('button', { name: 'Delete semester' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();

    await page.waitForURL('/semesters/');
    await expect(page.getByRole('link', { name: 'Winter semester 2023/2024' })).not.toBeVisible();
});

test("Can't delete non-empty semester", async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsTeacher(page);

    await page.getByRole('link', { name: 'Winter semester 2025/2026' }).click();
    await page.getByRole('button', { name: 'Edit semester' }).click();
    await page.getByRole('button', { name: 'Delete semester' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();

    await expect(page.getByText('The semester cannot be deleted because it contains subjects')).toBeVisible();

    await page.goto('/semesters/');
    await expect(page.getByRole('link', { name: 'Winter semester 2025/2026' })).toBeVisible();
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new semester', async ({ page }) => {
        await page.goto('/semesters/');

        const response = await page.request.post('/api/semesters/', {
            data: {
                year: 2069,
                type: 'summer',
                startDate: '2069-06-01',
                endDate: '2069-09-30',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new semester', async ({ page }) => {
        await page.goto('/semesters/');
        await loginAsAdmin(page);

        const response = await page.request.post('/api/semesters/', {
            data: {
                year: 2069,
                type: 'summer',
                startDate: '2069-06-01',
                endDate: '2069-09-30',
            },
        });

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit semester', async ({ page }) => {
        await page.goto('/semesters/');

        const response = await page.request.patch('/api/semesters/', {
            data: {
                id: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                year: 2069,
                type: 'summer',
                startDate: '2069-06-01',
                endDate: '2069-09-30',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit semester', async ({ page }) => {
        await page.goto('/semesters/');
        await loginAsAdmin(page);

        const response = await page.request.patch('/api/semesters/', {
            data: {
                id: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                year: 2069,
                type: 'summer',
                startDate: '2069-06-01',
                endDate: '2069-09-30',
            },
        });

        expect(response.status()).toBe(200);
    });

    test('Logged-out user cannot delete semester', async ({ page }) => {
        await page.goto('/semesters/');

        const response = await page.request.delete('/api/semesters/', {
            data: null,
            params: {
                id: 'b2805b48-3d24-4169-8f67-88561345ee99',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can delete semester', async ({ page }) => {
        await page.goto('/semesters/');
        await loginAsAdmin(page);

        const response = await page.request.delete('/api/semesters/', {
            data: null,
            params: {
                id: 'b2805b48-3d24-4169-8f67-88561345ee99',
            },
        });

        expect(response.status()).toBe(200);
    });
});
