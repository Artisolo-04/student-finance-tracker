import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 5173,
    allowedHosts: [
      'clump-stove-hamlet.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok-free.app',
    ],
  },
});
