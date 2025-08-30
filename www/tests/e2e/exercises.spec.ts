import { expect } from 'playwright/test';
import { loginAsAdmin, test } from './fixtures';

test('Can access exercises list', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');

    await expect(page.locator('body')).toContainText('Tryby pracy punktów dostępowych');
    await expect(page.locator('body')).toContainText('Wydajność sieci standardów IEEE 802.11');
    await expect(page.locator('body')).toContainText('Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11');

    await expect(page.locator('body')).toContainText(
        'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11 cz. II',
    );

    await expect(page.locator('body')).toContainText('Emulacja sieci bezprzewodowych');
    await expect(page.locator('body')).toContainText('Radius');
});

test('Can access exercise page', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await page.getByText('Tryby pracy punktów dostępowych').click();

    await expect(page.locator('.breadcrumb')).toContainText('Tryby pracy punktów dostępowych');
});

test('Add new exercise button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');

    await expect(page.getByRole('button', { name: 'Add new exercise' })).toHaveCount(0);
});

test('Add new exercise button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByText('Summer semester 2024/2025').click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await page.getByText('Lokalne sieci bezprzewodowe').click();
    await page.waitForURL('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe');

    await expect(page.getByRole('button', { name: 'Add new exercise' })).toBeVisible();
});

test('Can add new exercise and prevent duplicate exercise creation', async ({ page }) => {
    await page.goto('/semesters/2024-winter/');
    await loginAsAdmin(page);

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2024/2025');

    await page.getByText('Sieci komputerowe').click();
    await page.waitForURL('/semesters/2024-winter/sieci-komputerowe/');
    await expect(page.locator('.breadcrumb')).toContainText('Sieci komputerowe');

    await page.getByRole('button', { name: 'Add new exercise' }).click();

    await expect(page.locator('#exercise-modal')).toBeVisible();
    await expect(page.locator('#exercise-modal')).toContainText('Add new exercise');

    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Wirtualne sieci lokalne (VLAN)');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('5');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Wirtualne sieci lokalne (VLAN)');

    await page.goto('/semesters/2024-winter/sieci-komputerowe/');
    await expect(page.getByRole('link', { name: 'Wirtualne sieci lokalne (VLAN)' })).toBeVisible();

    // Cannot add duplicate exercise
    await page.goto('/semesters/2024-winter/sieci-komputerowe/');

    await page.getByRole('button', { name: 'Add new exercise' }).click();

    await expect(page.locator('#exercise-modal')).toBeVisible();
    await expect(page.locator('#exercise-modal')).toContainText('Add new exercise');

    // Existing name
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Wirtualne sieci lokalne (VLAN)');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('100');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('#exercise-modal').locator('form')).toContainText(
        'Exercise with this name or number already exists.',
    );

    // Existing number
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('WiFi Sieci bezprzewodowe standardów 802.11');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('1');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('#exercise-modal').locator('form')).toContainText(
        'Exercise with this name or number already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new exercise' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Wirtualne sieci lokalne (VLAN)' })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'WiFi Sieci bezprzewodowe standardów 802.11' })).toHaveCount(0);
});

test('Edit exercise button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/1/');

    await expect(page.getByRole('button', { name: 'Edit exercise' })).toHaveCount(0);
});

test('Edit exercise button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByText('Summer semester 2024/2025').click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await page.getByText('Lokalne sieci bezprzewodowe').click();
    await page.waitForURL('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe');

    await page.getByText('Tryby pracy punktów dostępowych').click();
    await page.waitForURL('/semesters/2024-summer/lokalne-sieci-bezprzewodowe/1/');
    await expect(page.locator('.breadcrumb')).toContainText('Tryby pracy punktów dostępowych');

    await expect(page.getByRole('button', { name: 'Edit exercise' })).toBeVisible();
});

test('Can edit exercise and prevent duplicate exercise', async ({ page }) => {
    // Can edit exercise with data that do not match already existing exercise
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByText('Winter semester 2024/2025').click();
    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2024/2025');

    await page.getByText('Sieci komputerowe').click();
    await expect(page.locator('.breadcrumb')).toContainText('Sieci komputerowe');

    await page.getByText('IPv6 cz. II').click();
    await expect(page.locator('.breadcrumb')).toContainText('IPv6 cz. II');

    await expect(page.getByRole('button', { name: 'Edit exercise' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit exercise' }).click();

    await expect(page.locator('#edit-exercise-modal-2024-winter-sieci-komputerowe-4')).toBeVisible();

    await expect(page.locator('#edit-exercise-modal-2024-winter-sieci-komputerowe-4')).toContainText(
        'Edit exercise IPv6 cz. II',
    );

    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Wirtualne sieci lokalne (VLAN)');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('4');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Wirtualne sieci lokalne (VLAN)');
    await expect(page.locator('body')).toContainText('Wirtualne sieci lokalne (VLAN)');

    // Can not edit exercise with data that match already existing exercise
    await page.getByRole('button', { name: 'Edit exercise' }).click();

    await expect(page.locator('#edit-exercise-modal-2024-winter-sieci-komputerowe-4')).toBeVisible();

    await expect(page.locator('#edit-exercise-modal-2024-winter-sieci-komputerowe-4')).toContainText(
        'Edit exercise Wirtualne sieci lokalne (VLAN)',
    );

    // Existing name
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Diagnostyka sieci IPv4');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('100');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('#edit-exercise-modal-2024-winter-sieci-komputerowe-4').locator('form')).toContainText(
        'Exercise with this name or number already exists.',
    );

    // Existing number
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('IPv6 cz. II');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('1');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await expect(page.locator('#edit-exercise-modal-2024-winter-sieci-komputerowe-4').locator('form')).toContainText(
        'Exercise with this name or number already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Wirtualne sieci lokalne (VLAN)');
    await expect(page.locator('body')).toContainText('Wirtualne sieci lokalne (VLAN)');
});
