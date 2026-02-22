import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
    compressHTML: false,
    base: '/',
    trailingSlash: 'always',
    output: 'server',
    adapter: node({
        mode: 'middleware',
    }),
    security: {
        allowedDomains: [{}],
    },
    integrations: [vue()],
    vite: {
        ssr: {
            target: 'node',
            noExternal: import.meta.env.PROD ? true : undefined,
            external: ['bcrypt', 'express', 'on-headers', 'pg', 'canvas'],
        },
        envDir: '.',
    },
    session: {
        driver: 'redis',
        options: {
            url: process.env.REDIS_URL,
        },
        ttl: 60 * 60 * 3, // 3 hours
    },
});
