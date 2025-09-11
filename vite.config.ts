import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      proxy: {
        '/api/proxy': {
          target: 'http://jenkins.chkok.kr:8000',
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(
              /^\/api\/proxy/,
              `/api/monitor?format=json&key=${env.VITE_JENKINS_API_KEY}`
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
  };
});
