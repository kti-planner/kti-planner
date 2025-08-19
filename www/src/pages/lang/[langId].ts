import type { APIRoute } from 'astro';
import { isLangId } from '@backend/lang';

export const GET: APIRoute = ({ cookies, params, url, redirect }) => {
    const { langId } = params;

    if (langId === undefined || !isLangId(langId)) {
        return new Response(null, { status: 404 });
    }

    let nextPage = url.searchParams.get('next') ?? '/';
    if (new URL(nextPage, url).origin !== url.origin) {
        nextPage = '/';
    }

    cookies.set('langId', langId, {
        path: '/',
        secure: true,
    });

    return redirect(nextPage, 303);
};
