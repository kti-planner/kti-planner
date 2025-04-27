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
    integrations: [vue()],
    vite: {
        ssr: {
            target: 'node',
            noExternal: true,
            external: ['bcrypt', 'connect-redis', 'express', 'express-session', 'on-headers', 'pg', 'redis'],
        },
    },
});
