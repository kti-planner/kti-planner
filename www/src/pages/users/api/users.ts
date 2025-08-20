import type { APIRoute } from 'astro';
import { z } from 'zod';
import { User } from '@backend/user';

const schema = z.object({
    name: z.string().trim().nonempty(),
    email: z.string().trim().nonempty(),
    password: z.string().nonempty(),
    passwordRepeated: z.string().nonempty(),
    role: z.enum(['teacher', 'admin']),
});

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (user?.role !== 'admin') {
        return Response.json(null, { status: 404 });
    }

    const data = schema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    if (data.password !== data.passwordRepeated) {
        return Response.json(false, { status: 200 });
    }

    const otherUser = await User.fetchByEmail(data.email);

    if (otherUser) {
        return Response.json(false, { status: 200 });
    }

    await User.create({ name: data.name, email: data.email, password: data.password, role: data.role });

    return Response.json(true, { status: 201 });
};

const schemaEdit = z.object({
    id: z.uuid(),
    name: z.string().trim().optional(),
    email: z.string().trim().optional(),
});

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = schemaEdit.nullable().catch(null).parse(jsonData);

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
