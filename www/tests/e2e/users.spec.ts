import { expect } from 'playwright/test';
import { login, loginAsTeacher, test } from './fixtures';

test('Cannot access users page when logged-out', async ({ page }) => {
    await page.goto('/users/');
    await expect(page).toHaveURL('/login/?next=%2Fusers%2F');
});

test('Can access users page when logged-in', async ({ page }) => {
    await page.goto('/users/');
    await login(page);

    await expect(page).toHaveURL('/users/');
    await expect(page.getByRole('navigation')).toContainText('Users');

    await expect(page.locator('body')).toContainText('Admin');
    await expect(page.locator('body')).toContainText('Bogdan Nowak');
    await expect(page.locator('body')).toContainText('Jan Kowalski');
});

test('Add new user button is hidden for non-admin user', async ({ page }) => {
    await page.goto('/users/');
    await loginAsTeacher(page);

    await expect(page.getByRole('button', { name: 'Add new user' })).toHaveCount(0);
});

test('Add new user button is visible for admin user', async ({ page }) => {
    await page.goto('/users/');
    await login(page);

    await expect(page.getByRole('button', { name: 'Add new user' })).toHaveCount(1);
});

test('Can add new user and prevent duplicate user creation', async ({ page }) => {
    await page.goto('/users/');
    await login(page);

    await page.getByRole('button', { name: 'Add new user' }).click();

    await expect(page.getByRole('heading', { name: 'Add new user' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password');
    await page.getByRole('combobox', { name: 'Role' }).selectOption('teacher');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByRole('button', { name: 'Add new user' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Test User' })).toHaveCount(1);

    // Cannot add duplicate user
    await page.getByRole('button', { name: 'Add new user' }).click();

    // Existing email
    await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('password');
    await page.getByRole('combobox', { name: 'Role' }).selectOption('teacher');

    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.locator('#user-modal').locator('form')).toContainText('Adding new user failed.');

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.getByRole('button', { name: 'Add new user' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Test User' })).toHaveCount(1);

    // Can login as new user
    await page.getByRole('button', { name: 'Sign out' }).click();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.locator('form').getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('navigation')).toContainText("You're logged in as Test User");
});

test('Can generate random password when adding new user', async ({ page }) => {
    await page.goto('/users/');
    await login(page);

    await page.getByRole('button', { name: 'Add new user' }).click();

    await expect(page.getByRole('heading', { name: 'Add new user' })).toBeVisible();

    await page.getByRole('button', { name: 'Generate random password' }).click();

    await expect(page.getByRole('textbox', { name: 'Password', exact: true })).toHaveValue(/^.{16}$/);
    const password = await page.getByRole('textbox', { name: 'Password', exact: true }).inputValue();

    await page.getByRole('button', { name: 'Generate random password' }).click();

    await expect(page.getByRole('textbox', { name: 'Password', exact: true })).toHaveValue(/^.{16}$/);
    const secondPassword = await page.getByRole('textbox', { name: 'Password', exact: true }).inputValue();

    expect(password).not.toBe(secondPassword);
});

test('Cannot access user profile when logged-out', async ({ page }) => {
    await page.goto('/users/feeaa186-3d69-4801-a580-88be10d53553/');
    await expect(page).toHaveURL('/login/?next=%2Fusers%2Ffeeaa186-3d69-4801-a580-88be10d53553%2F');

    await page.goto('/profile/');
    await expect(page).toHaveURL('/login/?next=%2Fprofile%2F');
});

test('Can access user profile when logged-in', async ({ page }) => {
    await page.goto('/users/c393c524-453c-4b02-bfad-5114fe828200/');
    await login(page);

    await expect(page).toHaveURL('/users/c393c524-453c-4b02-bfad-5114fe828200/');
    await expect(page.getByRole('navigation')).toContainText('Jan Kowalski');

    await expect(page.locator('body')).toContainText('User profile');
    await expect(page.locator('body')).toContainText('Name: Jan Kowalski');
    await expect(page.locator('body')).toContainText('Email: jan@kowalski.pl');
    await expect(page.locator('body')).toContainText('Role: Teacher');

    await page.goto('/profile/');

    await expect(page).toHaveURL('/profile/');
    await expect(page.getByRole('navigation')).toContainText('Admin');

    await expect(page.locator('body')).toContainText('User profile');
    await expect(page.locator('body')).toContainText('Name: Admin');
    await expect(page.locator('body')).toContainText('Email: admin@admin.com');
    await expect(page.locator('body')).toContainText('Role: Admin');
});

test('Edit user button is hidden for non-admin user whose profile is not theirs', async ({ page }) => {
    await page.goto('/users/c393c524-453c-4b02-bfad-5114fe828200/');
    await loginAsTeacher(page);

    await expect(page.getByRole('navigation')).toContainText('Jan Kowalski');
    await expect(page.getByRole('button', { name: 'Edit user' })).toHaveCount(0);
});

test('Edit user button is visible for admin user and user whose profile is theirs', async ({ page }) => {
    // As admin
    await page.goto('/users/feeaa186-3d69-4801-a580-88be10d53553/');
    await login(page);

    await expect(page.getByRole('navigation')).toContainText('Bogdan Nowak');
    await expect(page.getByRole('button', { name: 'Edit user' })).toHaveCount(1);

    // As teacher
    await page.getByRole('button', { name: 'Sign out' }).click();
    await page.goto('/users/feeaa186-3d69-4801-a580-88be10d53553/');
    await loginAsTeacher(page);

    await expect(page.getByRole('navigation')).toContainText('Bogdan Nowak');
    await expect(page.getByRole('button', { name: 'Edit user' })).toHaveCount(1);
});

test('Edit user role is hidden for non-admin user', async ({ page }) => {
    await page.goto('/profile/');
    await loginAsTeacher(page);

    await page.getByRole('button', { name: 'Edit user' }).click();

    await expect(page.getByRole('combobox', { name: 'Role' })).toHaveCount(0);
});

test('Edit user role is visible for admin user', async ({ page }) => {
    await page.goto('/users/c393c524-453c-4b02-bfad-5114fe828200/');
    await login(page);

    await page.getByRole('button', { name: 'Edit user' }).click();

    await expect(page.getByRole('combobox', { name: 'Role' })).toHaveCount(1);
});

test('Can edit user data and prevent duplicate user as admin', async ({ page }) => {
    await page.goto('/users/feeaa186-3d69-4801-a580-88be10d53553/');
    await login(page);

    await expect(page.getByRole('navigation')).toContainText('Bogdan Nowak');

    await page.getByRole('button', { name: 'Edit user' }).click();

    await page.getByRole('textbox', { name: 'Name' }).fill('BogdanX NowakX');
    await page.getByRole('textbox', { name: 'Email' }).fill('bogdanx@nowakx.pl');
    await page.getByRole('combobox', { name: 'Role' }).selectOption('admin');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('body')).toContainText('Name: BogdanX NowakX');
    await expect(page.locator('body')).toContainText('Email: bogdanx@nowakx.pl');
    await expect(page.locator('body')).toContainText('Role: Admin');

    // Cannot edit user with data that match already existing user
    await page.getByRole('button', { name: 'Edit user' }).click();

    // Existing email
    await page.getByRole('textbox', { name: 'Name' }).fill('BogdanX NowakX');
    await page.getByRole('textbox', { name: 'Email' }).fill('jan@kowalski.pl');
    await page.getByRole('combobox', { name: 'Role' }).selectOption('teacher');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('#edit-user-modal-feeaa186-3d69-4801-a580-88be10d53553').locator('form')).toContainText(
        'User with that email already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('body')).toContainText('Name: BogdanX NowakX');
    await expect(page.locator('body')).toContainText('Email: bogdanx@nowakx.pl');
    await expect(page.locator('body')).toContainText('Role: Admin');
});

test('Can edit user data and prevent duplicate user as teacher', async ({ page }) => {
    await page.goto('/profile/');
    await loginAsTeacher(page);

    await expect(page.getByRole('navigation')).toContainText('Bogdan Nowak');

    await page.getByRole('button', { name: 'Edit user' }).click();

    await page.getByRole('textbox', { name: 'Name' }).fill('BogdanX NowakX');
    await page.getByRole('textbox', { name: 'Email' }).fill('bogdanx@nowakx.pl');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('body')).toContainText('Name: BogdanX NowakX');
    await expect(page.locator('body')).toContainText('Email: bogdanx@nowakx.pl');
    await expect(page.locator('body')).toContainText('Role: Teacher');

    // Cannot edit user with data that match already existing user
    await page.getByRole('button', { name: 'Edit user' }).click();

    // Existing email
    await page.getByRole('textbox', { name: 'Name' }).fill('BogdanX NowakX');
    await page.getByRole('textbox', { name: 'Email' }).fill('jan@kowalski.pl');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.locator('#edit-user-modal-feeaa186-3d69-4801-a580-88be10d53553').locator('form')).toContainText(
        'User with that email already exists.',
    );

    await page.getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('body')).toContainText('Name: BogdanX NowakX');
    await expect(page.locator('body')).toContainText('Email: bogdanx@nowakx.pl');
    await expect(page.locator('body')).toContainText('Role: Teacher');
});
