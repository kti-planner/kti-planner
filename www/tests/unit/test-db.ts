import crypto from 'node:crypto';
import pg from 'pg';
import { afterAll, beforeAll } from 'vitest';
import { db, dbOptions } from '@backend/db';
import initSql from '../../../db/00-init.sql?raw';

const parentDbClient = new pg.Client(dbOptions);
const dbName = `testing_${Date.now()}_${crypto.randomInt(1e8)}`;

beforeAll(async () => {
    await parentDbClient.connect();
    await parentDbClient.query(`CREATE DATABASE ${dbName}`);

    db.options.database = dbName;

    await db.query(initSql);
});

afterAll(async () => {
    await db.end();
    await parentDbClient.query(`DROP DATABASE ${dbName}`);
    await parentDbClient.end();
});
