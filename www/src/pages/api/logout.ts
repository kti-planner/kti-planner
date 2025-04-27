import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ locals, redirect }) => {
    const { req } = locals;
    locals.session.userId = null;

    await new Promise<void>(resolve => {
        req.session.regenerate(() => {
            resolve();
        });
    });

    return redirect('/');
};
