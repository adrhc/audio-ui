import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/audio-ui': {
        target: "https://adrhc.go.ro",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
