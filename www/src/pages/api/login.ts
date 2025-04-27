import type { APIRoute } from 'astro';
import { z } from 'zod';
import { User } from '@backend/user';

const loginErrors = {
    email: {
        empty: 'Email cannot be empty',
        invalid: 'Enter valid email',
    },
    password: 'Password cannot be empty',
    form: 'Invalid credentials',
} as const;

const schema = z.object({
    email: z.string().nonempty({ message: loginErrors.email.empty }).email({ message: loginErrors.email.invalid }),
    password: z.string().nonempty({ message: loginErrors.password }),
});

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, req } = locals;
    const parseResult = schema.safeParse(jsonData);

    if (!parseResult.success) {
        const errors = parseResult.error.flatten().fieldErrors;

        return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
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

        return new Response(null, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const errors = { form: [loginErrors.form] };
    return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
    });
};
