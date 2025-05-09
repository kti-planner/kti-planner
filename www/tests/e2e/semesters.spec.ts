import { expect } from 'playwright/test';
import { login, test } from './test-setup';

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

//TODO: This test won't pass for now, because new db is not created on next test runs
// test('Can add new semester', async ({ page }) => {
//     await page.goto('/semesters/');
//     await login(page);

//     await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
//     await page.getByRole('button', { name: 'Add new semester' }).click();

//     await expect(page.locator('#semesterModalLabel')).toContainText('Add new semester');

//     await page.getByRole('dialog').getByRole('combobox').selectOption('summer');
//     await page.getByRole('dialog').getByRole('spinbutton').fill('2100');
//     await page.getByRole('dialog').locator('#startDate').fill('2100-02-21');
//     await page.getByRole('dialog').locator('#endDate').fill('2100-06-14');

//     await page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true }).click();

//     await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
//     await expect(page.getByRole('link', { name: 'Summer Semester 2100/2101' })).toBeVisible();
//     await expect(page.locator('body')).toContainText('Summer semester 2100/2101');
// });

test('Can not add duplicate semester', async ({ page }) => {
    await page.goto('/semesters/');
    await login(page);

    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
    await page.getByRole('button', { name: 'Add new semester' }).click();

    await expect(page.locator('#semesterModalLabel')).toContainText('Add new semester');

    await page.getByRole('dialog').getByRole('combobox').selectOption('summer');
    await page.getByRole('dialog').getByRole('spinbutton').fill('2023');
    await page.getByRole('dialog').locator('#startDate').fill('2024-02-21');
    await page.getByRole('dialog').locator('#endDate').fill('2024-06-14');

    await page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByRole('dialog').locator('span')).toContainText(
        'Semester with this year and type already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('button', { name: 'Add new semester' })).toBeVisible();
});
