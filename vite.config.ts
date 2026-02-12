import {svelte} from '@sveltejs/vite-plugin-svelte';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import {defineConfig} from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({


        plugins: [svelte(), tailwindcss(), devtoolsJson(), dts({ tsconfigPath: './tsconfig.json' })],
        build: {
            sourcemap: true,
            minify: false,


            lib: {
                entry: path.resolve('src/index.ts'),
                name: 'SvelteGantt',
                fileName: (format) => `svelte-gantt.${format}.js`
            },
            rollupOptions: {
                external: ['svelte'],
                output: {
                    globals: {
                        svelte: 'Svelte'
                    }
                }
            },

        },
        css: {
            devSourcemap: true,
        },
        resolve: {
            alias: {
                '$lib': path.resolve('src/lib'),
            },
        },
});
