import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ redirect, session }) => {
    if (!session) {
        throw new Error('Session storage has not been configured!');
    }

    session.destroy();
    return redirect('/', 303);
};
