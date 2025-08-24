import { expect, test } from 'vitest';
import { User, type UserCreateData, type UserEditData } from '@backend/user';

interface UserCreateTestData extends UserCreateData {
    password: string;
}

const exampleUser: UserCreateTestData = {
    name: 'First',
    email: 'first@test.com',
    password: 'pass1',
    role: 'admin',
};

const secondUser: UserCreateTestData = {
    name: 'Second',
    email: 'second@test.com',
    password: 'pass2',
    role: 'teacher',
};

test('Users', async () => {
    const user1 = await User.create(exampleUser);

    expect(user1).toHaveProperty('name', exampleUser.name);
    expect(user1).toHaveProperty('email', exampleUser.email);
    expect(user1).toHaveProperty('role', exampleUser.role);

    const user2 = await User.create(secondUser);

    expect(user2).toHaveProperty('name', secondUser.name);
    expect(user2).toHaveProperty('email', secondUser.email);
    expect(user2).toHaveProperty('role', secondUser.role);

    // Cannot create duplicate users
    await expect(User.create(exampleUser)).rejects.toThrow();

    // Can fetch by id
    expect(await User.fetch(user1.id)).toStrictEqual(user1);

    // Can fetch by email
    expect(await User.fetchByEmail(exampleUser.email)).toStrictEqual(user1);

    // Cannot fetch nonexistant
    expect(await User.fetch(crypto.randomUUID())).toBeNull();
    expect(await User.fetchByEmail('unknown@test.com')).toBeNull();

    {
        // Can fetch all
        const users = await User.fetchAll();

        expect(users[0]).toHaveProperty('name', exampleUser.name);
        expect(users[0]).toHaveProperty('email', exampleUser.email);
        expect(users[0]).toHaveProperty('role', exampleUser.role);

        expect(users[1]).toHaveProperty('name', secondUser.name);
        expect(users[1]).toHaveProperty('email', secondUser.email);
        expect(users[1]).toHaveProperty('role', secondUser.role);
    }

    {
        // Can fetch bulk
        let users = await User.fetchBulk([]);

        expect(users).toStrictEqual([]);

        users = await User.fetchBulk([user1.id]);

        expect(users).toHaveLength(1);
        expect(users[0]).toHaveProperty('name', exampleUser.name);
        expect(users[0]).toHaveProperty('email', exampleUser.email);
        expect(users[0]).toHaveProperty('role', exampleUser.role);

        users = await User.fetchBulk([user2.id]);

        expect(users).toHaveLength(1);
        expect(users[0]).toHaveProperty('name', secondUser.name);
        expect(users[0]).toHaveProperty('email', secondUser.email);
        expect(users[0]).toHaveProperty('role', secondUser.role);

        users = await User.fetchBulk([user2.id, user1.id]);

        expect(users[0]).toHaveProperty('name', secondUser.name);
        expect(users[0]).toHaveProperty('email', secondUser.email);
        expect(users[0]).toHaveProperty('role', secondUser.role);
        expect(users[1]).toHaveProperty('name', exampleUser.name);
        expect(users[1]).toHaveProperty('email', exampleUser.email);
        expect(users[1]).toHaveProperty('role', exampleUser.role);
    }

    // Can edit
    const editSpec: UserEditData = {
        name: 'e' + exampleUser.name,
        email: 'e' + exampleUser.email,
        password: 'e' + exampleUser.password,
        role: user1.role === 'admin' ? 'teacher' : 'admin',
    };

    await user1.edit(editSpec);

    expect(user1).toHaveProperty('name', editSpec.name);
    expect(user1).toHaveProperty('email', editSpec.email);
    expect(user1).toHaveProperty('role', editSpec.role);

    const user1c = await User.fetch(user1.id);
    expect(user1c).toHaveProperty('name', editSpec.name);
    expect(user1c).toHaveProperty('email', editSpec.email);
    expect(user1c).toHaveProperty('role', editSpec.role);

    // Recognises password
    expect(await user2.checkPassword(secondUser.password)).toBe(true);

    // Rejects invalid password
    expect(await user2.checkPassword(secondUser.password + ' ')).toBe(false);
});
