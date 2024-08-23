import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*'],
      },
      injectManifest: {
        globPatterns: ['**/*'],
      },
      strategies: 'injectManifest',
      devOptions: {
        enabled: true,
      },
      filename: 'notification-sw.js',
      manifest: {
        name: 'Elysium Messenger',
        short_name: 'Elysium Messenger',
        theme_color: '#476cff',
        display: 'standalone',
        background_color: '#476cff',
        icons: [
          {
            src: 'assets/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
