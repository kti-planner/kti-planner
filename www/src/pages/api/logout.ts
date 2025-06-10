import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect, session }) => {
    session?.set('userId', null);
    await session?.regenerate();
    return redirect('/', 303);
};
