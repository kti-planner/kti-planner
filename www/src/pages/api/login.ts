import type { APIRoute } from 'astro';
import { z } from 'zod';
import { User } from '@backend/user';

const schema = z.object({
    email: z.string(),
    password: z.string(),
});

export const POST: APIRoute = async ({ locals, session }) => {
    const { jsonData } = locals;

    const data = schema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    session?.set('userId', null);

    await session?.regenerate();

    const user = await User.fetchByEmail(data.email);

    if (user && (await user.checkPassword(data.password))) {
        session?.set('userId', user.id);

        return Response.json(true, { status: 200 });
    }

    return Response.json(false, { status: 200 });
};
