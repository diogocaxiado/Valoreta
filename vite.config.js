import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(), 
    VitePWA({
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'icons/*.svg',
        'fonts/*.ttf',
      ],
      manifest: {
        name: 'Valoreta',
        short_name: 'Valoreta',
        theme_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globIgnores: ['**/index-Djb3DaPx.js']
      },
      devOptions: {
        enabled: true
      },
    })
  ],
});
