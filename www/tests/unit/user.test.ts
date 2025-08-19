import { expect, test } from 'vitest';
import { User, type UserCreateData, type UserEditData } from '@backend/user';

interface UserCreateTestData extends UserCreateData {
    id: string;
    password: string;
}

const exampleUser: UserCreateTestData = {
    id: '',
    name: 'First',
    email: 'first@test.com',
    password: 'pass1',
    role: 'admin',
};

const secondUser: UserCreateTestData = {
    id: '',
    name: 'Second',
    email: 'second@test.com',
    password: 'pass2',
    role: 'teacher',
};

test('Can create users', async () => {
    const user = await User.create(exampleUser);
    exampleUser.id = user.id;

    expect(user).toHaveProperty('name', exampleUser.name);
    expect(user).toHaveProperty('email', exampleUser.email);
    expect(user).toHaveProperty('role', exampleUser.role);

    const user2 = await User.create(secondUser);
    secondUser.id = user2.id;

    expect(user2).toHaveProperty('name', secondUser.name);
    expect(user2).toHaveProperty('email', secondUser.email);
    expect(user2).toHaveProperty('role', secondUser.role);
});

test('Cannot create duplicate users', async () => {
    await expect(User.create(exampleUser)).rejects.toThrow();
});

test('Can fetch by id', async () => {
    const user = await User.fetch(exampleUser.id);

    expect(user).toHaveProperty('name', exampleUser.name);
    expect(user).toHaveProperty('email', exampleUser.email);
    expect(user).toHaveProperty('role', exampleUser.role);
});

test('Can fetch by email', async () => {
    const user = await User.fetchByEmail(exampleUser.email);

    expect(user).toHaveProperty('name', exampleUser.name);
    expect(user).toHaveProperty('email', exampleUser.email);
    expect(user).toHaveProperty('role', exampleUser.role);
});

test('Cannot fetch nonexistant', async () => {
    const user = await User.fetch(crypto.randomUUID());
    expect(user).toBeNull();

    const user2 = await User.fetchByEmail('unknown@test.com');
    expect(user2).toBeNull();
});

test('Can fetch multiple', async () => {
    const users = await User.fetchAll();

    const user1 = users.find(u => u.id === exampleUser.id);

    expect(user1).toHaveProperty('name', exampleUser.name);
    expect(user1).toHaveProperty('email', exampleUser.email);
    expect(user1).toHaveProperty('role', exampleUser.role);

    const user2 = users.find(u => u.id === secondUser.id);

    expect(user2).toHaveProperty('name', secondUser.name);
    expect(user2).toHaveProperty('email', secondUser.email);
    expect(user2).toHaveProperty('role', secondUser.role);
});

test('Can edit', async () => {
    let user = await User.fetch(exampleUser.id);
    expect(user).not.toBeNull();

    const editSpec: UserEditData = {
        name: 'e' + exampleUser.name,
        email: 'e' + exampleUser.email,
        password: 'e' + exampleUser.password,
        role: user?.role === 'admin' ? 'teacher' : 'admin',
    };

    await user!.edit(editSpec);

    user = await User.fetch(exampleUser.id);
    expect(user).toHaveProperty('name', editSpec.name);
    expect(user).toHaveProperty('email', editSpec.email);
    expect(user).toHaveProperty('role', editSpec.role);
});

test('Recognises password', async () => {
    const user = await User.fetch(secondUser.id);
    expect(user).not.toBeNull();

    const valid = await user!.checkPassword(secondUser.password);
    expect(valid).toBe(true);
});

test('Rejects invalid password', async () => {
    const user = await User.fetch(secondUser.id);
    expect(user).not.toBeNull();

    const valid = await user!.checkPassword(secondUser.password + ' ');
    expect(valid).toBe(false);
});
