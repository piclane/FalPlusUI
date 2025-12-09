import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // CRA used "homepage": "/falp". Align Vite base path accordingly.
  base: '/falp',
  plugins: [react(), tsconfigPaths(), svgr()],
  envPrefix: ['REACT_APP_', 'VITE_'],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:8091/', changeOrigin: true },
      '/tv': { target: 'http://localhost:8092/', changeOrigin: true },
      '/images': { target: 'http://localhost:8092/', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
  },
}));
