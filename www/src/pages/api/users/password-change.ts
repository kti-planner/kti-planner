import type { APIRoute } from 'astro';
import { passwordChangeApiSchema } from '@components/users/passwords/types';

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = passwordChangeApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    if (data.newPassword !== data.newPasswordRepeated) {
        return Response.json(false, { status: 200 });
    }

    if (!(await user.checkPassword(data.currentPassword))) {
        return Response.json(false, { status: 200 });
    }

    await user.edit({ password: data.newPassword });

    return Response.json(true, { status: 200 });
};
