import { afterAll, beforeAll, expect, test } from 'vitest';
import { getTestDb } from './db';
import { User } from './user';

const [initDb, cleanupDb] = getTestDb();
beforeAll(initDb);
afterAll(cleanupDb);

const exampleUser = {
    id: '',
    name: 'First',
    email: 'first@test.com',
    password: 'pass1',
};
const secondUser = {
    id: '',
    name: 'Second',
    email: 'second@test.com',
    password: 'pass2',
};

function expectUser(user: User | null | undefined, check: typeof exampleUser) {
    expect(user).toHaveProperty('name', check.name);
    expect(user).toHaveProperty('email', check.email);
}

test('Can create users', async () => {
    const user = await User.create(exampleUser);
    exampleUser.id = user.id;
    expectUser(user, exampleUser);

    const user2 = await User.create(secondUser);
    secondUser.id = user2.id;
    expectUser(user2, secondUser);
});

test('Cannot create duplicate users', async () => {
    await expect(User.create(exampleUser)).rejects.toThrow();
});

test('Can fetch by id', async () => {
    const user = await User.fetch(exampleUser.id);
    expectUser(user, exampleUser);
});

test('Can fetch by email', async () => {
    const user = await User.fetchByEmail(exampleUser.email);
    expectUser(user, exampleUser);
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
    expectUser(user1, exampleUser);
    const user2 = users.find(u => u.id === secondUser.id);
    expectUser(user2, secondUser);
});

test('Can edit', async () => {
    let user = await User.fetch(exampleUser.id);
    expect(user).not.toBeNull();
    const editSpec = {
        name: 'e' + exampleUser.name,
        email: 'e' + exampleUser.email,
        password: 'e' + exampleUser.password,
    };
    await user!.edit(editSpec);

    user = await User.fetch(exampleUser.id);
    expect(user).toHaveProperty('name', editSpec.name);
    expect(user).toHaveProperty('email', editSpec.email);
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
