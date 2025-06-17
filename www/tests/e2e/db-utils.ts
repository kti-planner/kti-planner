import 'dotenv/config';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const dumpsDir = '/var/lib/postgresql/data/dumps';

const user = process.env.POSTGRES_USER;
if (user === undefined) {
    throw new Error('Missing POSTGRES_USER env variable');
}
const db = process.env.POSTGRES_DB;
if (db === undefined) {
    throw new Error('Missing POSTGRES_DB env variable');
}

export async function dumpDb(fileName = 'dump.sql') {
    await execAsync(`docker compose exec postgres pg_dump -U ${user!} ${db!} --clean -f ${dumpsDir}/${fileName}`);
}

export async function restoreDb(fileName = 'dump.sql') {
    await execAsync(`docker compose exec postgres psql -U ${user!} ${db!} -f ${dumpsDir}/${fileName} -q`);
}
