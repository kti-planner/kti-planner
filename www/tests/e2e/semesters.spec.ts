import { expect } from 'playwright/test';
import { login, test } from './fixtures';

test('Can access semesters from /', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('Winter semester 2024/2025');
    await expect(page.locator('body')).toContainText('Summer semester 2023/2024');
    await expect(page.locator('body')).toContainText('Winter semester 2023/2024');
});

test('Can access semesters from /semesters/', async ({ page }) => {
    await page.goto('/semesters/');

    await expect(page.locator('body')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('Winter semester 2024/2025');
    await expect(page.locator('body')).toContainText('Summer semester 2023/2024');
    await expect(page.locator('body')).toContainText('Winter semester 2023/2024');
});

test('Can access semester page', async ({ page }) => {
    await page.goto('/');

    await page.getByText('Summer semester 2024/2025').click();
    await page.waitForURL('/semesters/summer-2024/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
});

test('Can not add new semester when not logged in', async ({ page }) => {
    await page.goto('/semesters/');

    await expect(page.getByRole('button', { name: 'Add new semester' })).toHaveCount(0);
});

test('Can add new semester when logged in', async ({ page }) => {
    await page.goto('/semesters/');
    await login(page);

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
});

test('Can add new semester and prevent duplicate semester creation', async ({ page }) => {
    //Can add new semester
    await page.goto('/semesters/');
    await login(page);

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
    await page.getByRole('button', { name: 'Add new semester' }).click();

    await expect(page.locator('#semester-modal')).toBeVisible();
    await expect(page.locator('#semester-modal')).toContainText('Add new semester');

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('summer');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2100');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2100-02-21');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2100-06-14');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2100/2101');

    //Can not add duplicate semester
    await page.goto('/semesters/');

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
    await page.getByRole('button', { name: 'Add new semester' }).click();

    await expect(page.locator('#semester-modal')).toBeVisible();
    await expect(page.locator('#semester-modal')).toContainText('Add new semester');

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('summer');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2100');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2100-02-21');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2100-06-14');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('#semester-modal').locator('form')).toContainText(
        'Semester with this year and type already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
});

test('Can not edit semester when not logged in', async ({ page }) => {
    await page.goto('/semesters/');

    await page.getByText('Summer semester 2024/2025').click();
    await page.waitForURL('/semesters/summer-2024/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await expect(page.getByRole('button', { name: 'edit semester' })).toHaveCount(0);
});

test('Can add edit semester when logged in', async ({ page }) => {
    await page.goto('/semesters/');
    await login(page);

    await page.getByText('Summer semester 2024/2025').click();
    await page.waitForURL('/semesters/summer-2024/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await expect(page.getByRole('button', { name: 'edit semester' })).toBeVisible();
});

test('Can edit semester', async ({ page }) => {
    //Can not edit semester with data that do not match already existing semester
    await page.goto('/semesters/');
    await login(page);

    await page.getByText('Summer semester 2024/2025').click();

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
    await expect(page.locator('body')).toContainText('24.02.2025 - 15.06.2025');

    await expect(page.getByRole('button', { name: 'edit semester' })).toBeVisible();
    await page.getByRole('button', { name: 'edit semester' }).click();

    await expect(page.locator('#edit-semester-modal-summer-2024')).toBeVisible();
    await expect(page.locator('#edit-semester-modal-summer-2024')).toContainText('Edit semester 2024/2025');

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('winter');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2069');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2069-10-01');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2070-02-15');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2069/2070');
    await expect(page.locator('body')).toContainText('1.10.2069 - 15.02.2070');

    //Can not edit semester with data that match already existing semester
    await page.getByRole('button', { name: 'edit semester' }).click();

    await expect(page.locator('#edit-semester-modal-winter-2069')).toBeVisible();
    await expect(page.locator('#edit-semester-modal-winter-2069')).toContainText('Edit semester 2069/2070');

    await page.getByRole('combobox', { name: 'Semester type' }).selectOption('winter');
    await page.getByRole('spinbutton', { name: 'Academic year' }).fill('2023');
    await page.getByRole('textbox', { name: 'Semester start date' }).fill('2023-10-01');
    await page.getByRole('textbox', { name: 'Semester end date' }).fill('2023-02-15');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('#edit-semester-modal-winter-2069').locator('form')).toContainText(
        'Semester with this year and type already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2069/2070');
    await expect(page.locator('body')).toContainText('1.10.2069 - 15.02.2070');
});
