import type { APIRoute } from 'astro';
import { User } from '@backend/user';
import { loginApiSchema } from '@components/users/types';

export const POST: APIRoute = async ({ locals, session }) => {
    const { jsonData } = locals;

    const data = loginApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    if (!session) {
        throw new Error('Session storage has not been configured!');
    }

    session.set('userId', null);

    await session.regenerate();

    const user = await User.fetchByEmail(data.email);

    if (user && (await user.checkPassword(data.password))) {
        session.set('userId', user.id);

        return Response.json(true, { status: 200 });
    }

    return Response.json(false, { status: 200 });
};
