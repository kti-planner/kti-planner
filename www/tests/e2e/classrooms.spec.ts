import { expect } from 'playwright/test';
import { login, test } from './fixtures';

test('Cannot access classrooms list when logged-out', async ({ page }) => {
    await page.goto('/classrooms/');
    await expect(page).toHaveURL('/login/?next=%2Fclassrooms%2F');
});

test('Can access classrooms list when logged-in', async ({ page }) => {
    await page.goto('/');
    await login(page);
    await expect(page).toHaveURL('/');
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');

    await page.getByRole('button', { name: 'Add new exercise' }).click();
    await page.getByRole('link', { name: 'Manage classrooms' }).click();

    await expect(page.locator('body')).toContainText('EA 142');
    await expect(page.locator('body')).toContainText('EA 204');
    await expect(page.locator('body')).toContainText('Zdalnie');
});

test('Can add new classroom and prevent duplicate classroom creation', async ({ page }) => {
    await page.goto('/');
    await login(page);
    await expect(page).toHaveURL('/');
    await page.goto('/classrooms/');

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
    await page.goto('/');
    await login(page);
    await expect(page).toHaveURL('/');
    await page.goto('/classrooms/');

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
