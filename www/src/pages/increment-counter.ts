import type { APIRoute } from 'astro';
import { db } from '@backend/db';

export const POST: APIRoute = async ({ locals, redirect }) => {
    const { formData } = locals;

    const countParam = formData?.get('count') ?? '1';

    if (typeof countParam !== 'string') {
        return new Response(null, { status: 400 });
    }

    const count = countParam === '' ? 1 : parseInt(countParam);

    if (!(0 <= count && count <= 100)) {
        return new Response(null, { status: 400 });
    }

    for (let i = 0; i < count; i++) {
        await db.query('INSERT INTO counter VALUES (0)');
    }

    return redirect('/', 303);
};
