import type { APIRoute } from 'astro';
import { getNextPage } from 'src/utils';
import { isLangId } from '@backend/lang';

export const GET: APIRoute = ({ cookies, params, url, redirect }) => {
    const { langId } = params;

    if (langId === undefined || !isLangId(langId)) {
        return new Response(null, { status: 404 });
    }

    cookies.set('langId', langId, {
        path: '/',
        secure: true,
    });

    return redirect(getNextPage(url), 303);
};
