import pg from 'pg';

const env = import.meta.env.PROD ? process.env : import.meta.env;

export const dbOptions: pg.ClientConfig = {
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT ?? '5432'),
};

export const db = new pg.Pool({
    ...dbOptions,
    max: 10,
});
