import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // During local dev: /api requests → Express on localhost:5000
      // In production: Express serves React and handles /api natively
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
