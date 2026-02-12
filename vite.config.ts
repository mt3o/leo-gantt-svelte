import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss(), devtoolsJson()],
  resolve: {
    alias: {
      '$lib': path.resolve('src/lib'),
    },
  },
});
