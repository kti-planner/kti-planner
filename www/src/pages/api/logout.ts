import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ locals, redirect }) => {
    locals.session.userId = null;
    await new Promise((resolve, reject) => locals.session.save(resolve));

    await new Promise((resolve, reject) => locals.session.regenerate(resolve));

    locals.session = locals.req.session;

    await new Promise((resolve, reject) => locals.session.save(resolve));

    return redirect('/', 303);
};
