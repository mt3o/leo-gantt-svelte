import { svelte } from '@sveltejs/vite-plugin-svelte';
import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib';

  return {
    plugins: [svelte(), tailwindcss(), devtoolsJson()],
    build: {
      sourcemap: 'inline',
      minify: false,
      ...(isLib && {
        lib: {
          entry: path.resolve('src/lib/index.ts'),
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
        }
      }),
    },
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '$lib': path.resolve('src/lib'),
      },
    },
  };
});
