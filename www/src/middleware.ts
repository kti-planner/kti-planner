import { defineMiddleware } from 'astro:middleware';
import { makeLoginNextParam } from 'src/utils';
import { isLangId, langIds } from '@backend/lang';
import { User } from '@backend/user';

export const onRequest = defineMiddleware(async ({ request, locals, cookies, session, url, redirect }, next) => {
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
        const langId = locals.req?.acceptsLanguages(langIds) as LangId | false | undefined;
        locals.langId = langId !== false && langId !== undefined ? langId : 'pl';

        cookies.set('langId', locals.langId, {
            path: '/',
            secure: true,
            maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
        });
    } else {
        locals.langId = langIdCookie;
    }

    const userId = await session?.get('userId');
    if (userId !== undefined && userId !== null) {
        locals.user = await User.fetch(userId);
    } else {
        locals.user = null;
    }

    locals.redirectToLoginPage = () => {
        return redirect(`/login/${makeLoginNextParam(url)}`);
    };

    return await next();
});
