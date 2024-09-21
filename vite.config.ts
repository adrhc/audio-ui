import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/audio-ui/db-api/': {
        target: 'http://192.168.0.1:8082', // NAS
        // target: 'http://localhost:8082', // IDEA local development
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audio-ui\/db-api\//, '/api/'),
      },
      '/audio-ui/api/keflsx': {
        target: 'http://192.168.0.1:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audio-ui/, ''),
      },
      '/audio-ui/api/': {
        // target: 'http://192.168.0.1:8085', // NAS
        // target: 'http://127.0.0.1:8085', // IDEA local development
        target: 'http://192.168.0.1:8083', // Raspberry Pi
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audio-ui/, ''),
      },
      '/easyeffects/api/': {
        target: 'http://192.168.0.1:8086',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/easyeffects/, ''),
      },
      '/mopidy': {
        target: 'ws://192.168.0.32:6680',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
