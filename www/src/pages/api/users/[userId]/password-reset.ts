import type { APIRoute } from 'astro';
import { User } from '@backend/user';
import { passwordResetApiSchema } from '@components/users/passwords/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (user?.role !== 'admin') {
        return Response.json(null, { status: 404 });
    }

    const userToEdit = await User.fetch(params.userId ?? '');

    if (!userToEdit) {
        return Response.json(null, { status: 404 });
    }

    const data = passwordResetApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    await userToEdit.edit({ password: data.password });

    return Response.json(true, { status: 200 });
};
