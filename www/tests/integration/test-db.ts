import crypto from 'node:crypto';
import pg from 'pg';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { db, dbOptions, setDatabase } from '@backend/db';
import initSql from '../../../db/00-init.sql?raw';

const parentDbClient = new pg.Client(dbOptions);
const dbName = `testing_${Date.now()}_${crypto.randomInt(1e8)}`;

beforeAll(async () => {
    await parentDbClient.connect();
});

afterAll(async () => {
    await parentDbClient.end();
});

beforeEach(async () => {
    await parentDbClient.query(`CREATE DATABASE ${dbName}`);

    setDatabase({
        ...dbOptions,
        database: dbName,
    });

    await db.query(initSql);
});

afterEach(async () => {
    await db.end();
    await parentDbClient.query(`DROP DATABASE ${dbName}`);
});
