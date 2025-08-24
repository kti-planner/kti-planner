import type { APIRoute } from 'astro';
import { User } from '@backend/user';
import { userCreateApiSchema, userEditApiSchema } from '@components/users/types';

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

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = userEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const userToEdit = await User.fetch(data.id);

    if (!userToEdit) {
        return Response.json(false, { status: 200 });
    }

    if (userToEdit.id !== user.id && user.role !== 'admin') {
        return Response.json(null, { status: 403 });
    }

    const otherUser = await User.fetchByEmail(data.email ?? userToEdit.email);

    if (otherUser && otherUser.id !== userToEdit.id) {
        return Response.json(false, { status: 200 });
    }

    await userToEdit.edit({ name: data.name, email: data.email });

    return Response.json(true, { status: 200 });
};
