import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ redirect, session, url }) => {
    if (!session) {
        throw new Error('Session storage has not been configured!');
    }

    session.destroy();

    let nextPage = url.searchParams.get('next') ?? '/';
    if (new URL(nextPage, url).origin !== url.origin) {
        nextPage = '/';
    }

    return redirect(nextPage, 303);
};
