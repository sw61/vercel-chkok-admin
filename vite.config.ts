import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
    },
    proxy: {
      // '/grafana'로 시작하는 모든 요청을 실제 Grafana 서버로 전달합니다.
      '/grafana': {
        target: 'http://grafana.chkok.kr', // 실제 Grafana 도메인
        changeOrigin: true, // 호스트 헤더를 타겟 도메인으로 변경 (CORS 해결)
        secure: false, // 대상 서버가 HTTPS를 사용하지 않는 경우 (HTTP이므로 설정)
        // rewrite 설정이 필요하다면 여기에 추가할 수 있지만,
        // 요청 경로가 /grafana/d/... 형태로 유지되므로 대부분의 경우 필요하지 않습니다.
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
