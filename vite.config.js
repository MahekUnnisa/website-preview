import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Vite injects the app bundle into <head>; keep /runtime-env.js before it so window.__ENV__ exists when the app runs. */
function runtimeEnvFirst() {
  return {
    name: 'runtime-env-first',
    transformIndexHtml(html) {
      const tag = '<script src="/runtime-env.js"></script>';
      const without = html.replace(new RegExp(`\\s*${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), '');
      if (without.includes('<script type="module"')) {
        return without.replace(/<script type="module"/, `${tag}\n  <script type="module"`);
      }
      return without.replace('</head>', `  ${tag}\n</head>`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), runtimeEnvFirst()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});

