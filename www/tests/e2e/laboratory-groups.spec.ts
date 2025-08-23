import { expect } from 'playwright/test';
import { login, test } from './fixtures';

test('Can view and select groups', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');

    await expect(page.getByRole('button', { name: 'inf1a' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'inf1b' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'inf2a' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'inf2b' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'inf3a' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'inf3b' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'inf1a' })).not.toContainClass('btn-success');
    await expect(page.getByRole('button', { name: 'inf1b' })).not.toContainClass('btn-success');
    await page.getByRole('button', { name: 'inf1a' }).click();
    await expect(page.getByRole('button', { name: 'inf1a' })).toContainClass('btn-success');
    await page.getByRole('button', { name: 'inf1b' }).click();
    await expect(page.getByRole('button', { name: 'inf1b' })).toContainClass('btn-success');
    await page.getByRole('button', { name: 'inf1a' }).click();
    await expect(page.getByRole('button', { name: 'inf1a' })).not.toContainClass('btn-success');
    await page.getByRole('button', { name: 'inf1b' }).click();
    await expect(page.getByRole('button', { name: 'inf1b' })).not.toContainClass('btn-success');

    await expect(page.getByRole('textbox', { name: 'New group' })).not.toBeVisible();
});

test('Can add groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await login(page);

    await page.getByRole('textbox', { name: 'New group' }).fill('inf4a');
    await page.getByRole('button', { name: 'Add group' }).click();
    await expect(page.getByRole('button', { name: 'inf4a' })).toBeVisible();

    await page.getByRole('textbox', { name: 'New group' }).fill('inf4a');
    await page.getByRole('button', { name: 'Add group' }).click();
    await expect(page.getByText('This group already exists')).toBeVisible();
});

test('Can edit groups and prevent duplicates', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await login(page);

    await page.getByRole('button', { name: 'inf1a' }).click();
    await page.getByRole('textbox', { name: 'Edit name' }).fill('inf4a');
    await page.getByRole('button', { name: 'Save group name' }).click();
    await expect(page.getByRole('button', { name: 'inf1a' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'inf4a' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Edit name' }).fill('inf2a');
    await page.getByRole('button', { name: 'Save group name' }).click();
    await expect(page.getByText('This group already exists')).toBeVisible();
});
