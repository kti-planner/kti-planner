import type { APIRoute } from 'astro';
import { User } from '@backend/user';
import { userEditRoleApiSchema } from '@components/users/types';

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (user?.role !== 'admin') {
        return Response.json(null, { status: 404 });
    }

    const data = userEditRoleApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const userToEdit = await User.fetch(data.id);

    if (!userToEdit) {
        return Response.json(false, { status: 200 });
    }

    await userToEdit.edit({ role: data.role });

    return Response.json(true, { status: 200 });
};
