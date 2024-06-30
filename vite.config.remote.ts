import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // OPENSSL_CONF=./openssl.cnf npm run dev-from-remote
    proxy: {
      '/audio-ui/db-api/': {
        target: 'https://adrhc.go.ro',
        changeOrigin: true,
      },
      '/audio-ui/api/': {
        target: 'https://adrhc.go.ro',
        changeOrigin: true,
      },
      '/easyeffects/api/': {
        target: 'https://adrhc.go.ro',
        changeOrigin: true,
      },
      '/mopidy': {
        target: 'https://adrhc.go.ro',
        changeOrigin: true,
        ws: true,
        // auth: 'user:pwd'
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
