import { defineMiddleware } from 'astro:middleware';
import { isLangId, langIds } from '@backend/lang';

declare module 'express-session' {
    interface SessionData {
        counter?: number;
    }
}

export const onRequest = defineMiddleware(async ({ request, locals, cookies }, next) => {
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

    const langIdCookie = cookies.get('langId')?.value;
    if (langIdCookie === undefined || !isLangId(langIdCookie)) {
        const langId = locals.req.acceptsLanguages(langIds) as LangId | false;
        locals.langId = langId !== false ? langId : 'pl';
        cookies.set('langId', locals.langId, {
            path: '/',
            secure: true,
        });
    } else {
        locals.langId = langIdCookie;
    }

    return next();
});
