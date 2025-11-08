import { expect } from 'playwright/test';
import { loginAsAdmin, loginAsTeacher, test } from './fixtures';

test('Can access subject list', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await expect(page.locator('body')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');
    await expect(page.locator('body')).toContainText('Zarządzanie bezpieczeństwem sieci - Informatyka sem. VI');
});

test('Can access subject page', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');
});

test('Add new subject button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');

    await expect(page.getByRole('button', { name: 'Add new subject' })).toHaveCount(0);
});

test('Add new subject button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await expect(page.getByRole('button', { name: 'Add new subject' })).toBeVisible();
});

test('Can add new subject and prevent duplicate subject creation', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');
    await loginAsAdmin(page);

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');

    await page.getByRole('button', { name: 'Add new subject' }).click();

    await expect(page.getByRole('heading', { name: 'Add new subject' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Sieci komputerowe - Informatyka');
    await page.getByRole('combobox', { name: 'Study mode' }).selectOption('Full-time');
    await page.getByRole('combobox', { name: 'Study cycle' }).selectOption('First-cycle');
    await page.getByRole('combobox', { name: 'Semester' }).selectOption('5');
    await page.getByRole('textbox', { name: 'Moodle course ID' }).fill('1472');
    await page.getByRole('textbox', { name: 'Description' }).fill('Subject test description <script>alert(0)</script>');
    await page.getByRole('combobox', { name: 'Teachers' }).selectOption('Jan Kowalski');
    await page.getByRole('combobox', { name: 'Duration' }).selectOption('105 min');
    await page.getByRole('spinbutton', { name: 'How many weeks are between classes?' }).fill('1');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Sieci komputerowe - Informatyka sem. V');
    await expect(page.getByRole('link', { name: 'enauczanie' })).toHaveAttribute('href', /^.+1472$/);
    await expect(page.locator('body')).toContainText('Subject test description');
    await expect(page.locator('body')).not.toContainText('<script>alert(0)</script>');

    await page.goto('/semesters/2024-summer/');
    await expect(page.getByRole('link', { name: 'Sieci komputerowe - Informatyka sem. V' })).toBeVisible();

    // Cannot add duplicate subject
    await page.getByRole('button', { name: 'Add new subject' }).click();

    await expect(page.getByRole('heading', { name: 'Add new subject' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Sieci komputerowe - Informatyka');
    await page.getByRole('combobox', { name: 'Study mode' }).selectOption('Full-time');
    await page.getByRole('combobox', { name: 'Study cycle' }).selectOption('First-cycle');
    await page.getByRole('combobox', { name: 'Semester' }).selectOption('5');
    await page.getByRole('combobox', { name: 'Teachers' }).selectOption('Jan Kowalski');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Subject with this name already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new subject' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sieci komputerowe - Informatyka sem. V' })).toHaveCount(1);
});

test('Edit subject button is hidden for logged-out user', async ({ page }) => {
    await page.goto('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');

    await expect(page.getByRole('button', { name: 'Edit subject' })).toHaveCount(0);
});

test('Edit subject button is visible for logged-in user', async ({ page }) => {
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();
    await page.waitForURL('/semesters/2024-summer/');
    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();
    await page.waitForURL('/semesters/2024-summer/subjects/lokalne-sieci-bezprzewodowe---informatyka-sem.-vi/');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');

    await expect(page.getByRole('button', { name: 'Edit subject' })).toBeVisible();
});

test('Can edit subject and prevent duplicate subject', async ({ page }) => {
    // Can edit subject with data that do not match already existing subject
    await page.goto('/semesters/');
    await loginAsAdmin(page);

    await page.getByRole('link', { name: 'Summer semester 2024/2025' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Summer semester 2024/2025');
    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');

    await expect(page.getByRole('button', { name: 'Edit subject' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit subject' }).click();

    await expect(page.getByRole('heading', { name: 'Edit subject Lokalne sieci bezprzewodowe' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Sieci Ethernet i IP');
    await page.getByRole('combobox', { name: 'Study mode' }).selectOption('Part-time');
    await page.getByRole('combobox', { name: 'Study cycle' }).selectOption('Second-cycle');
    await page.getByRole('combobox', { name: 'Semester' }).selectOption('6');
    await page.getByRole('textbox', { name: 'Moodle course ID' }).fill('15');
    await page.getByRole('textbox', { name: 'Description' }).fill('Test description');
    await page.getByRole('combobox', { name: 'Teachers' }).selectOption('Admin');
    await page.getByRole('combobox', { name: 'Duration' }).selectOption('165 min');
    await page.getByRole('spinbutton', { name: 'How many weeks are between classes?' }).fill('2');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Sieci Ethernet i IP');
    await expect(page.getByRole('link', { name: 'enauczanie' })).toHaveAttribute('href', /^.+15$/);
    await expect(page.locator('body')).toContainText('Sieci Ethernet i IP');
    await expect(page.locator('body')).toContainText('Test description');

    // Can not edit subject with data that match already existing subject
    await page.getByRole('button', { name: 'Edit subject' }).click();

    await expect(page.getByRole('heading', { name: 'Edit subject Sieci Ethernet i IP' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Subject name' }).fill('Zarządzanie bezpieczeństwem sieci - Informatyka');
    await page.getByRole('combobox', { name: 'Study mode' }).selectOption('Full-time');
    await page.getByRole('combobox', { name: 'Study cycle' }).selectOption('First-cycle');
    await page.getByRole('combobox', { name: 'Semester' }).selectOption('6');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Subject with this name already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Sieci Ethernet i IP');
    await expect(page.locator('body')).toContainText('Sieci Ethernet i IP');
});

test('Can delete subject', async ({ page }) => {
    await page.goto('/semesters/2024-summer/');
    await loginAsTeacher(page);

    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();
    await page.getByRole('button', { name: 'Edit subject' }).click();
    await page.getByRole('button', { name: 'Delete subject' }).click();
    await page.getByRole('button', { name: 'Yes' }).click();

    await page.waitForURL('/semesters/2024-summer/');

    await expect(
        page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }),
    ).not.toBeVisible();
});

test('Can copy subject from previous semester and prevent duplicate subject copy', async ({ page }) => {
    await page.goto('/semesters/2025-winter/');
    await loginAsAdmin(page);

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2025/2026');

    await page.getByRole('button', { name: 'Add new subject' }).click();
    await expect(page.getByRole('heading', { name: 'Add new subject' })).toBeVisible();

    await page.getByRole('button', { name: 'Copy subject from previous semester' }).click();
    await expect(page.getByRole('heading', { name: 'Copy subject from previous semester' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Semester to copy from' }).selectOption('Summer semester 2024/2025');

    await page
        .getByRole('combobox', { name: 'Subject to copy' })
        .selectOption('Lokalne sieci bezprzewodowe - Informatyka sem. VI - Full-time first-cycle studies');

    await page.getByRole('button', { name: 'Copy' }).click();

    await expect(page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' })).toBeVisible();

    await page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' }).click();

    await expect(page.locator('.breadcrumb')).toContainText('Winter semester 2025/2026');
    await expect(page.locator('.breadcrumb')).toContainText('Lokalne sieci bezprzewodowe - Informatyka sem. VI');

    // Verify copied subject content
    // Laboratory groups
    await expect(page.locator('label').filter({ hasText: '5A' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '5B' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '6A' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '6B' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '7A' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: '7B' })).toBeVisible();

    // Exercises
    await expect(page.locator('body')).toContainText('Tryby pracy punktów dostępowych');
    await expect(page.locator('body')).toContainText('Wydajność sieci standardów IEEE 802.11');
    await expect(page.locator('body')).toContainText('Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11');

    await expect(page.locator('body')).toContainText(
        'Podstawowe mechanizmy zabezpieczeń sieci standardu 802.11 cz. II',
    );

    await expect(page.locator('body')).toContainText('Emulacja sieci bezprzewodowych');
    await expect(page.locator('body')).toContainText('Radius');

    // Teachers
    await expect(page.locator('body')).toContainText('Jan Kowalski');
    await expect(page.locator('body')).toContainText('Bogdan Nowak');

    // Cannot copy duplicate subject
    await page.goto('/semesters/2025-winter/');

    await page.getByRole('button', { name: 'Add new subject' }).click();
    await expect(page.getByRole('heading', { name: 'Add new subject' })).toBeVisible();

    await page.getByRole('button', { name: 'Copy subject from previous semester' }).click();
    await expect(page.getByRole('heading', { name: 'Copy subject from previous semester' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Semester to copy from' }).selectOption('Summer semester 2024/2025');

    await page
        .getByRole('combobox', { name: 'Subject to copy' })
        .selectOption('Lokalne sieci bezprzewodowe - Informatyka sem. VI - Full-time first-cycle studies');

    await page.getByRole('button', { name: 'Copy' }).click();

    await expect(page.getByText('Subject with this name already exists.')).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('link', { name: 'Lokalne sieci bezprzewodowe - Informatyka sem. VI' })).toHaveCount(1);
});

test.describe('API fetch tests', () => {
    test('Logged-out user cannot create new subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');

        const response = await page.request.post('/semesters/api/subjects/', {
            data: {
                name: 'New Subject',
                semesterId: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                teacherIds: ['c393c524-453c-4b02-bfad-5114fe828200'],
                description: '',
                moodleCourseId: '',
                durationMinutes: 105,
                classRepeatWeeks: 1,
                studyMode: 'full-time',
                studyCycle: 'first-cycle',
                semesterNumber: 5,
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can create new subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');
        await loginAsAdmin(page);

        const response = await page.request.post('/semesters/api/subjects/', {
            data: {
                name: 'New Subject',
                semesterId: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                teacherIds: ['c393c524-453c-4b02-bfad-5114fe828200'],
                description: '',
                moodleCourseId: '',
                durationMinutes: 105,
                classRepeatWeeks: 1,
                studyMode: 'full-time',
                studyCycle: 'first-cycle',
                semesterNumber: 5,
            },
        });

        expect(response.status()).toBe(201);
    });

    test('Logged-out user cannot edit subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');

        const response = await page.request.patch('/semesters/api/subjects/', {
            data: {
                id: '3f58b671-5b38-43f8-bf0f-49d93048c52e',
                name: 'Updated Subject',
                teacherIds: ['feeaa186-3d69-4801-a580-88be10d53553'],
                description: '',
                moodleCourseId: '',
                durationMinutes: 165,
                classRepeatWeeks: 2,
                studyMode: 'part-time',
                studyCycle: 'second-cycle',
                semesterNumber: 6,
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can edit subject', async ({ page }) => {
        await page.goto('/semesters/2024-summer/');
        await loginAsAdmin(page);

        const response = await page.request.patch('/semesters/api/subjects/', {
            data: {
                id: '3f58b671-5b38-43f8-bf0f-49d93048c52e',
                name: 'Updated Subject',
                teacherIds: ['feeaa186-3d69-4801-a580-88be10d53553'],
                description: '',
                moodleCourseId: '',
                durationMinutes: 165,
                classRepeatWeeks: 2,
                studyMode: 'part-time',
                studyCycle: 'second-cycle',
                semesterNumber: 6,
            },
        });

        expect(response.status()).toBe(200);
    });

    test('Logged-out user cannot delete subject', async ({ page }) => {
        await page.goto('/semesters/');

        const response = await page.request.delete('/semesters/api/subjects/', {
            data: null,
            params: {
                id: '3f58b671-5b38-43f8-bf0f-49d93048c52e',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can delete subject', async ({ page }) => {
        await page.goto('/semesters/');
        await loginAsAdmin(page);

        const response = await page.request.delete('/semesters/api/subjects/', {
            data: null,
            params: {
                id: '3f58b671-5b38-43f8-bf0f-49d93048c52e',
            },
        });

        expect(response.status()).toBe(200);
    });

    test('Logged-out user cannot copy subject from previous semester', async ({ page }) => {
        await page.goto('/semesters/2025-winter/');

        const response = await page.request.post('/semesters/2025-winter/api/subject-copy/', {
            data: {
                semesterId: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                subjectId: '25108321-0391-4c7a-b4d8-5ea20388e813',
            },
        });

        expect(response.status()).toBe(404);
    });

    test('Logged-in user can copy subject from previous semester', async ({ page }) => {
        await page.goto('/semesters/2025-winter/');
        await loginAsAdmin(page);

        const response = await page.request.post('/semesters/2025-winter/api/subject-copy/', {
            data: {
                semesterId: '094f8324-7c58-4566-b5d7-e4fe8ed03a18',
                subjectId: '25108321-0391-4c7a-b4d8-5ea20388e813',
            },
        });

        expect(response.status()).toBe(201);
    });
});
