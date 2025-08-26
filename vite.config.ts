import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        checker({ typescript: { tsconfigPath: './tsconfig.app.json' } }),
    ],
    optimizeDeps: {
        exclude: ['hollow-knight-save-parser'],
    },
    base: '/hk100planner/',
});
