import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ locals, redirect }) => {
    const { req } = locals;
    locals.session.userId = null;

    const savedCounter = locals.session.counter ?? 0;
    await new Promise<void>(resolve => {
        req.session.regenerate(() => {
            req.session.counter = savedCounter;
            resolve();
        });
    });

    return redirect('/');
};
