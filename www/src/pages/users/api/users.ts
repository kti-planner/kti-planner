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

    if (data.role && user.role !== 'admin') {
        return Response.json(null, { status: 403 });
    }

    const userToEdit = await User.fetch(data.id);

    if (!userToEdit) {
        return Response.json(null, { status: 404 });
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

export const DELETE: APIRoute = async ({ locals, url }) => {
    const { user } = locals;

    if (user?.role !== 'admin') {
        return Response.json(null, { status: 404 });
    }

    const id = url.searchParams.get('id');

    if (id === null) {
        return Response.json(null, { status: 400 });
    }

    const userToDelete = await User.fetch(id);

    if (!userToDelete || userToDelete.id === user.id) {
        return Response.json(null, { status: 400 });
    }

    await userToDelete.delete();

    return Response.json(true, { status: 200 });
};
