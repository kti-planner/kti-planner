import type { APIRoute } from 'astro';
import { z } from 'zod';
import { User } from '@backend/user';

const loginError = 'Invalid credentials';

const schema = z.object({
    email: z.string().nonempty().email(),
    password: z.string().nonempty(),
});

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, req } = locals;
    const parseResult = schema.safeParse(jsonData);

    if (!parseResult.success) {
        const errors = { form: loginError };
        return Response.json({ errors }, { status: 400 });
    }

    const { email, password } = parseResult.data;

    const user = await User.fetchByEmail(email);

    if (user && (await user.checkPassword(password))) {
        locals.session.userId = user.id;

        await new Promise<void>(resolve => {
            req.session.regenerate(() => {
                Object.assign(req.session, locals.session);
                resolve();
            });
        });

        return new Response(null, { status: 200 });
    }

    const errors = { form: loginError };
    return Response.json({ errors }, { status: 400 });
};
