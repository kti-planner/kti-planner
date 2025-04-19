import { defineMiddleware } from 'astro:middleware';

declare module 'express-session' {
    interface SessionData {
        counter?: number;
    }
}

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
    const contentType = request.headers.get('Content-Type')?.split(';', 1)[0];

    if (contentType === 'application/x-www-form-urlencoded' || contentType === 'multipart/form-data') {
        const formData = await request.formData().catch(() => null);

        if (!formData) {
            return new Response(null, { status: 400 });
        }

        locals.formData = formData;
    } else if (contentType === 'application/json') {
        const jsonData = (await request.json().catch(() => undefined)) as unknown;

        if (jsonData === undefined) {
            return new Response(null, { status: 400 });
        }

        locals.jsonData = jsonData;
    }

    return next();
});
