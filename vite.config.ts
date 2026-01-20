import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // the 192.168.0.1:* requests don't pass through nginx hence 
    // they get with the original encoding to the upstream server
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        configure: (proxy: any) => {
          // Custom middleware to log requests
          proxy.on('proxyReq', (_proxyReq: any, req: any) => {
            console.log(`Proxying request to upstream: ${req.method} ${req.originalUrl}`);
            // console.log(`Request headers sent to upstream:`);
            // console.log(proxyReq.getHeaders()); // Log the headers sent to the upstream
          });
          /* proxy.on('proxyRes', (proxyRes, _req, _res) => {
            console.log(`Response from upstream: ${proxyRes.statusCode}`);
          }); */
        },
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
    postcss: {
      plugins: [
        autoprefixer({}), // add options if needed
      ],
    },
  },
});
