import type { APIRoute } from 'astro';
import { z } from 'zod';
import { User } from '@backend/user';

const schema = z.object({
    email: z.string(),
    password: z.string(),
});

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData } = locals;

    const data = schema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    locals.session.userId = null;
    await new Promise((resolve, reject) => locals.session.save(resolve));

    await new Promise((resolve, reject) => locals.session.regenerate(resolve));

    locals.session = locals.req.session;

    const user = await User.fetchByEmail(data.email);

    if (user && (await user.checkPassword(data.password))) {
        locals.session.userId = user.id;
        await new Promise((resolve, reject) => locals.session.save(resolve));

        return Response.json(true, { status: 200 });
    }

    return Response.json(false, { status: 200 });
};
