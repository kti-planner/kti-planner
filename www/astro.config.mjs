import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
    compressHTML: false,
    base: '/',
    trailingSlash: 'always',
    output: 'server',
    adapter: node({
        mode: 'middleware',
    }),
    vite: {
        ssr: {
            target: 'node',
            noExternal: true,
            external: ['express'],
        },
    },
});
