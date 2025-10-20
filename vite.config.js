import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {
      VITE_API_URL: process.env.VITE_API_URL,
    },
  },
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Valorant',
        short_name: 'Valorant',
        description: 'A Valorant stats tracker app',
        theme_color: '#121212' 
      }
    })
  ],
});
