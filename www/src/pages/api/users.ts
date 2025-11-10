import type { APIRoute } from 'astro';
import { User } from '@backend/user';
import { userCreateApiSchema } from '@components/users/types';

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (user?.role !== 'admin') {
        return Response.json(null, { status: 404 });
    }

    const data = userCreateApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const otherUser = await User.fetchByEmail(data.email);

    if (otherUser) {
        return Response.json(false, { status: 200 });
    }

    await User.create({ name: data.name, email: data.email, password: data.password, role: data.role });

    return Response.json(true, { status: 201 });
};
