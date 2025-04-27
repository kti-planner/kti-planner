import pg from 'pg';

export const dbOptions: pg.ClientConfig = {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
};

export const db = new pg.Pool({
    ...dbOptions,
    max: 10,
});
