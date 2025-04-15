import { defineMiddleware } from 'astro:middleware';

declare module 'express-session' {
    interface SessionData {
        counter?: number;
    }
}

export const onRequest = defineMiddleware(async ({ request }, next) => {
    return next();
});
