import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Serves the whole /api surface from the Vite dev server so `npm run dev` needs no
// second process. The same Express app runs in production from serve.js.
function apiPlugin(): Plugin {
  return {
    name: 'wildinn-api',
    apply: 'serve',
    configureServer(server) {
      // Rebuilt per request so edits to server/**/*.js hot-reload in dev.
      // ssrLoadModule is internally cached by Vite and invalidated on file change.
      const getApp = () =>
        server
          .ssrLoadModule('/server/api.js')
          .then((m) => (m as { createApiApp: () => (req: unknown, res: unknown) => void }).createApiApp());
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();
        getApp()
          .then((app) => app(req, res))
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('[api] dev middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'api_unavailable' }));
          });
      });
    },
  };
}

export default defineConfig(({mode}) => {
  // Expose every var in .env / .env.local to process.env (server-side only; not bundled to the client).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'motion-vendor': ['motion']
          }
        }
      }
    },
    server: {

      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
