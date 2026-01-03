import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.API_PROXY_TARGET || 'http://localhost:8091/';
  const webProxyTarget = env.WEB_PROXY_TARGET || 'http://localhost:8092/';

  return {
    // CRA used "homepage": "/falp". Align Vite base path accordingly.
    base: '/falp',
    plugins: [react(), tsconfigPaths(), svgr()],
    envPrefix: ['REACT_APP_', 'VITE_'],
    server: {
      port: 3000,
      proxy: {
        '/api': { target: apiProxyTarget, changeOrigin: true },
        '/tv': { target: webProxyTarget, changeOrigin: true },
        '/images': { target: webProxyTarget, changeOrigin: true },
      },
    },
    build: {
      outDir: 'dist',
    },
  };
});
