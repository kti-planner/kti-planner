import pg from 'pg';
import { env } from 'src/utils';

export const dbOptions = Object.freeze<pg.PoolConfig>({
    database: env.POSTGRES_DB,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: parseInt(env.POSTGRES_PORT ?? '5432'),
    max: 10,
});

export let db = new pg.Pool(dbOptions);

export function setDatabase(options: pg.ClientConfig = dbOptions) {
    db = new pg.Pool(options);
}
