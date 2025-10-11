import assert from 'node:assert';
import { once } from 'node:events';
import fs from 'node:fs';
import { join } from 'node:path';
import bcrypt from 'bcrypt';
import { createCanvas } from 'canvas';
import { db } from '@backend/db';
import type { UserData } from '@components/users/types';

export type UserRole = 'admin' | 'teacher';

const env = import.meta.env.PROD ? process.env : import.meta.env;

interface DbUser {
    id: string;
    name: string;
    email: string;
    password_hash: string | null;
    role: UserRole;
}

export interface UserCreateData {
    name: string;
    email: string;
    password: string | null;
    role: UserRole;
}

export interface UserEditData {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | null | undefined;
    role?: UserRole | undefined;
}

export class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string | null;
    role: UserRole;

    constructor(data: DbUser) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.passwordHash = data.password_hash;
        this.role = data.role;
    }

    static async fetch(id: string): Promise<User | null> {
        const data = (await db.query<DbUser>('SELECT * FROM users WHERE id = $1', [id])).rows[0];

        return data ? new User(data) : null;
    }

    static async fetchByEmail(email: string): Promise<User | null> {
        const data = (await db.query<DbUser>('SELECT * FROM users WHERE email = $1', [email])).rows[0];

        return data ? new User(data) : null;
    }

    static async fetchAll(): Promise<User[]> {
        const records = (await db.query<DbUser>('SELECT * FROM users ORDER BY name')).rows;

        return records.map(record => new User(record));
    }

    static async fetchBulk(ids: string[]): Promise<(User | null)[]> {
        const users = await User.fetchAll();

        return ids.map(id => users.find(user => user.id === id) ?? null);
    }

    static async create(data: UserCreateData): Promise<User> {
        const passwordHash = data.password === null ? null : await User.hashPassword(data.password);

        const result = (
            await db.query<DbUser>(
                'INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [crypto.randomUUID(), data.name, data.email, passwordHash, data.role],
            )
        ).rows[0];

        assert(result);

        const user = new User(result);
        await user.createEmailImg();

        return user;
    }

    async edit(data: UserEditData): Promise<void> {
        if (data.name !== undefined) {
            this.name = data.name;
        }

        const prevEmail = this.email;
        if (data.email !== undefined) {
            this.email = data.email;
        }

        if (data.password !== undefined) {
            this.passwordHash = data.password === null ? null : await User.hashPassword(data.password);
        }

        if (data.role !== undefined) {
            this.role = data.role;
        }

        await db.query('UPDATE users SET name = $2, email = $3, password_hash = $4, role = $5 WHERE id = $1', [
            this.id,
            this.name,
            this.email,
            this.passwordHash,
            this.role,
        ]);

        if (data.email !== undefined && data.email !== prevEmail) {
            await this.createEmailImg();
        }
    }

    async checkPassword(password: string): Promise<boolean> {
        return this.passwordHash !== null && (await bcrypt.compare(password, this.passwordHash));
    }

    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async createEmailImg(): Promise<void> {
        assert(env.EMAIL_IMG_DIR !== undefined);

        const canvas = createCanvas(200, 100);
        const ctx = canvas.getContext('2d');
        const font = '16px sans-serif';
        ctx.font = font;

        const metrics = ctx.measureText(this.email);
        canvas.width = Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
        canvas.height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);

        // Canvas looses state after resize
        ctx.font = font;
        ctx.fillText(this.email, metrics.actualBoundingBoxLeft, metrics.actualBoundingBoxAscent);

        await fs.promises.mkdir(env.EMAIL_IMG_DIR, { recursive: true });

        const destination = join(env.EMAIL_IMG_DIR, `${this.id}.png`);

        const out = fs.createWriteStream(destination);
        const pngStream = canvas.createPNGStream();
        const writeStream = pngStream.pipe(out);
        await once(writeStream, 'finish');
    }
}

export function makeUserData(user: User): UserData {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
}
