import { expect } from 'playwright/test';
import { loginAsAdmin, test } from './fixtures';

test('Can access exercises list', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');

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
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await page.getByRole('link', { name: 'Tryby pracy punktów dostępowych' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Tryby pracy punktów dostępowych');
});

test('Add new exercise button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');

    await expect(page.getByRole('button', { name: 'Add new exercise' })).toHaveCount(0);
});

test('Add new exercise button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();
    await page.waitForURL('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');

    await expect(page.getByRole('button', { name: 'Add new exercise' })).toBeVisible();
});

test('Can add new exercise and prevent duplicate exercise creation', async ({ page }) => {
    await page.goto('/semesters/2024-winter/');
    await loginAsAdmin(page);

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2024/2025');

    await page.getByRole('link', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();
    await page.waitForURL('/semesters/2024-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await expect(page.locator('.breadcrumb')).toContainText('Sieci komputerowe - Informatyka sem. V');

    await page.getByRole('button', { name: 'Add new exercise' }).click();

    await expect(page.getByRole('heading', { name: 'Add new exercise' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Wirtualne sieci lokalne (VLAN)');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('5');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Wirtualne sieci lokalne (VLAN)');

    await page.goto('/semesters/2024-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');
    await expect(page.getByRole('link', { name: 'Wirtualne sieci lokalne (VLAN)' })).toBeVisible();

    // Cannot add duplicate exercise
    await page.goto('/semesters/2024-winter/subjects/sieci-komputerowe---informatyka-sem.-v/');

    await page.getByRole('button', { name: 'Add new exercise' }).click();

    await expect(page.getByRole('heading', { name: 'Add new exercise' })).toBeVisible();

    // Existing name
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Wirtualne sieci lokalne (VLAN)');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('100');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Exercise with this name or number already exists.')).toBeVisible();

    // Existing number
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('WiFi Sieci bezprzewodowe standardów 802.11');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('1');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Exercise with this name or number already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new exercise' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Wirtualne sieci lokalne (VLAN)' })).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'WiFi Sieci bezprzewodowe standardów 802.11' })).toHaveCount(0);
});

test('Edit exercise button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/1/');

    await expect(page.getByRole('button', { name: 'Edit exercise' })).toHaveCount(0);
});

test('Edit exercise button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();
    await page.waitForURL('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');

    await page.getByRole('link', { name: 'Tryby pracy punktów dostępowych' }).click();
    await page.waitForURL('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/1/');
    await expect(page.locator('.breadcrumb')).toContainText('Tryby pracy punktów dostępowych');

    await expect(page.getByRole('button', { name: 'Edit exercise' })).toBeVisible();
});

test('Can edit exercise and prevent duplicate exercise', async ({ page }) => {
    // Can edit exercise with data that do not match already existing exercise
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Winter semester 2024/2025' }).click();
    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2024/2025');

    await page.getByRole('link', { name: 'Sieci komputerowe - Informatyka sem. V' }).click();
    await expect(page.locator('.breadcrumb')).toContainText('Sieci komputerowe - Informatyka sem. V');

    await page.getByRole('link', { name: 'IPv6 cz. II' }).click();
    await expect(page.locator('.breadcrumb')).toContainText('IPv6 cz. II');

    await expect(page.getByRole('button', { name: 'Edit exercise' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit exercise' }).click();

    await expect(page.getByRole('heading', { name: 'Edit exercise IPv6 cz. II' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Wirtualne sieci lokalne (VLAN)');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('4');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Wirtualne sieci lokalne (VLAN)');
    await expect(page.locator('body')).toContainText('Wirtualne sieci lokalne (VLAN)');

    // Can not edit exercise with data that match already existing exercise
    await page.getByRole('button', { name: 'Edit exercise' }).click();

    await expect(page.getByRole('heading', { name: 'Edit exercise Wirtualne sieci lokalne (VLAN)' })).toBeVisible();

    // Existing name
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('Diagnostyka sieci IPv4');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('100');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Exercise with this name or number already exists.')).toBeVisible();

    // Existing number
    await page.getByRole('textbox', { name: 'Exercise name' }).fill('IPv6 cz. II');
    await page.getByRole('spinbutton', { name: 'Exercise number' }).fill('1');
    await page.getByRole('combobox', { name: 'Classroom' }).selectOption('EA 142');

    await expect(page.getByText('Exercise with this name or number already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Wirtualne sieci lokalne (VLAN)');
    await expect(page.locator('body')).toContainText('Wirtualne sieci lokalne (VLAN)');
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new exercise', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');

        const response = await page.request.post('/semesters/api/exercises/', {
            data: {
                name: 'Test Exercise',
                exerciseNumber: 7,
                subjectId: '25108321-0391-4c7a-b4d8-5ea20388e813',
                classroomId: '2affdc99-7dd6-47f0-b26c-3c413bf063dd',
                teacherId: 'c393c524-453c-4b02-bfad-5114fe828200',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new exercise', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
        await loginAsAdmin(page);

        const response = await page.request.post('/semesters/api/exercises/', {
            data: {
                name: 'Test Exercise',
                exerciseNumber: 7,
                subjectId: '25108321-0391-4c7a-b4d8-5ea20388e813',
                classroomId: '2affdc99-7dd6-47f0-b26c-3c413bf063dd',
                teacherId: 'c393c524-453c-4b02-bfad-5114fe828200',
            },
        });

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit exercise', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');

        const response = await page.request.patch('/semesters/api/exercises/', {
            data: {
                id: 'e4ffb869-8d1d-4396-89b5-f427af451e50',
                name: 'Updated Test Exercise',
                exerciseNumber: 8,
                classroomId: '8689d55d-508e-4f5d-aef8-d5052f220d20',
                teacherId: 'c393c524-453c-4b02-bfad-5114fe828200',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit exercise', async ({ page }) => {
        await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
        await loginAsAdmin(page);

        const response = await page.request.patch('/semesters/api/exercises/', {
            data: {
                id: 'e4ffb869-8d1d-4396-89b5-f427af451e50',
                name: 'Updated Test Exercise',
                exerciseNumber: 8,
                classroomId: '8689d55d-508e-4f5d-aef8-d5052f220d20',
                teacherId: 'c393c524-453c-4b02-bfad-5114fe828200',
            },
        });

        expect(response.status()).toBe(200);
    });
});
