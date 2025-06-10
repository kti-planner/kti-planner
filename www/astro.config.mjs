import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vue from '@astrojs/vue';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
    compressHTML: false,
    base: '/',
    trailingSlash: 'always',
    output: 'server',
    adapter: node({
        mode: 'middleware',
    }),
    integrations: [vue()],
    vite: {
        ssr: {
            target: 'node',
            external: ['bcrypt', 'connect-redis', 'express', 'express-session', 'on-headers', 'pg', 'redis'],
        },
    },
    session: {
        driver: 'redis',
        options: {
            url: env.REDIS_URL,
        },
        ttl: 60 * 60 * 3, // 3 hours
    },
});
