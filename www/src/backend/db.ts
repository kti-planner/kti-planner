import crypto from 'node:crypto';
import pg from 'pg';
import initSQL from '../../../db/init.sql?raw';

const dbOpts: pg.ClientConfig = {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
};

export const db = new pg.Pool({
    ...dbOpts,
    max: 10,
});

const parentDbClient = new pg.Client(dbOpts);

export function getTestDb() {
    const dbName = `testing_${Date.now()}_${crypto.randomInt(1e8)}`;

    const init = async () => {
        await parentDbClient.connect();
        await parentDbClient.query(`CREATE DATABASE ${dbName}`);
        db.options.database = dbName;
        await db.query(initSQL);
    };

    const cleanup = async () => {
        await db.end();
        await parentDbClient.query(`DROP DATABASE ${dbName}`);
    };

    return [init, cleanup] as const;
}
