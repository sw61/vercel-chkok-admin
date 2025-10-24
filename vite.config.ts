import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    server: {
      proxy: {
        '/grafana': {
          target: 'http://jenkins.chkok.kr:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/grafana/, ''),
        },
      },
    },

    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'output',
    },
  };
});
