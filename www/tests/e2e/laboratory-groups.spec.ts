import { expect } from 'playwright/test';
import { login, test } from './fixtures';

test('Can view and select groups', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');

    await expect(page.getByText('inf1a')).toBeVisible();
    await expect(page.getByText('inf1b')).toBeVisible();
    await expect(page.getByText('inf2a')).toBeVisible();
    await expect(page.getByText('inf2b')).toBeVisible();
    await expect(page.getByText('inf3a')).toBeVisible();
    await expect(page.getByText('inf3b')).toBeVisible();

    await expect(page.getByText('inf1a')).not.toContainClass('btn-success');
    await expect(page.getByText('inf1b')).not.toContainClass('btn-success');
    await page.getByText('inf1a').click();
    await expect(page.getByText('inf1a')).toContainClass('btn-success');
    await page.getByText('inf1b').click();
    await expect(page.getByText('inf1b')).toContainClass('btn-success');
    await page.getByText('inf1a').click();
    await expect(page.getByText('inf1a')).not.toContainClass('btn-success');
    await page.getByText('inf1b').click();
    await expect(page.getByText('inf1b')).not.toContainClass('btn-success');

    await expect(page.getByRole('button', { name: 'Edit groups' })).not.toBeVisible();
});

test('Can add groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await login(page);

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.getByRole('button', { name: 'Add new laboratory group' }).click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.locator('.btn', { hasText: 'inf4a' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.getByRole('button', { name: 'Add new laboratory group' }).click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByText('A group with this name already exists')).toBeVisible();
});

test('Can edit groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await login(page);

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.locator('.list-group-item', { hasText: 'inf1a' }).hover();
    await page.locator('.list-group-item', { hasText: 'inf1a' }).locator('button').click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('.btn', { hasText: 'inf1a' })).not.toBeVisible();
    await expect(page.locator('.btn', { hasText: 'inf4a' })).toBeVisible();

    await page.getByRole('button', { name: 'Edit groups' }).click();
    await page.locator('.list-group-item', { hasText: 'inf2a' }).hover();
    await page.locator('.list-group-item', { hasText: 'inf2a' }).locator('button').click();
    await page.getByRole('textbox', { name: 'Group name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('A group with this name already exists')).toBeVisible();
});
