import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'node',

        include: ['tests/**/*.test.ts'],
        exclude: ['build/**', 'node_modules/**'],
    },
});
