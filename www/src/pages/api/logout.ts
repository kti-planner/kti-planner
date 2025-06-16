import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ redirect, session }) => {
    session?.destroy();
    return redirect('/', 303);
};
