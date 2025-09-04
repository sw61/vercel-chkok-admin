import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api/proxy': {
        target: 'http://jenkins.chkok.kr:8000',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/proxy/,
            '/api/monitor?format=json&key=A2F1BFBCF4F802DBA645B5076ACAE2D1FD3EF404CF0DC3F988B93C47239C00B167F4B6F0274AF4E6D4B954CE020B71F99E1264FFB7EE1AD58E3108DE83BBADD0'
          ),
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
});
