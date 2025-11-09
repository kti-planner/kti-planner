import type { APIRoute } from 'astro';
import { User } from '@backend/user';
import { userEditApiSchema } from '@components/users/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const userToEdit = await User.fetch(params.userId ?? '');

    if (!userToEdit) {
        return Response.json(null, { status: 404 });
    }

    const data = userEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    if (data.role && user.role !== 'admin') {
        return Response.json(null, { status: 403 });
    }

    if (userToEdit.id !== user.id && user.role !== 'admin') {
        return Response.json(null, { status: 403 });
    }

    const otherUser = await User.fetchByEmail(data.email ?? userToEdit.email);

    if (otherUser && otherUser.id !== userToEdit.id) {
        return Response.json(false, { status: 200 });
    }

    await userToEdit.edit({ name: data.name, email: data.email, role: data.role });

    return Response.json(true, { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (user?.role !== 'admin') {
        return Response.json(null, { status: 404 });
    }

    const userToDelete = await User.fetch(params.userId ?? '');

    if (!userToDelete || userToDelete.id === user.id) {
        return Response.json(null, { status: 400 });
    }

    await userToDelete.delete();

    return Response.json(true, { status: 200 });
};
