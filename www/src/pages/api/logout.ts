import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ redirect, session, url }) => {
    if (!session) {
        throw new Error('Session storage has not been configured!');
    }

    session.destroy();

    const nextPage = url.searchParams.get('next') ?? '/';
    return redirect(nextPage, 303);
};
