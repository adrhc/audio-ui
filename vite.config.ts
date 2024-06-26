import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      /* '/audio-ui': {
        target: "https://adrhc.go.ro",
        changeOrigin: true,
      }, */
      '/audio-ui/api/keflsx': {
        target: 'http://192.168.1.31:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/audio-ui/, ''),
      },
      '/mopidy': {
        target: 'ws://192.168.1.32:6680',
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
