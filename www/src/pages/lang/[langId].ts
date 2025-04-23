import type { APIRoute } from 'astro';
import { isLangId } from '@backend/lang';

export const GET: APIRoute = ({ cookies, params, url, redirect }) => {
    const { langId } = params;

    if (langId === undefined || !isLangId(langId)) {
        return new Response(null, { status: 404 });
    }

    const nextPage = url.searchParams.get('next');

    cookies.set('langId', langId, {
        path: '/',
        secure: true,
    });

    return redirect(nextPage ?? '/', 303);
};
