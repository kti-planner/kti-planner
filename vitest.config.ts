import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()],
    envPrefix: 'POSTGRES_',
    test: {
        include: ['**/*.test.ts'],
        setupFiles: ['www/tests/unit/test-db.ts'],
    },
});
