import type { APIRoute } from 'astro';
import { db } from '@backend/db';

export const POST: APIRoute = async ({ redirect }) => {
    await db.query('INSERT INTO counter VALUES (0)');

    return redirect('/', 303);
};
