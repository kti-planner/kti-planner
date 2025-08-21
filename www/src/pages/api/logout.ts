import type { APIRoute } from 'astro';
import { getNextPage } from 'src/utils';

export const POST: APIRoute = ({ redirect, session, url }) => {
    if (!session) {
        throw new Error('Session storage has not been configured!');
    }

    session.destroy();

    return redirect(getNextPage(url), 303);
};
