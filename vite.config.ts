// file: vite.config.ts (MODIFIED FOR LOCAL BACKEND)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // THIS IS THE NEW PROXY CONFIGURATION
    proxy: {
      // The frontend will now use the prefix '/api/v1' (matching the backend routes)
      "/api/v1": {
        // Redirect the request to your local Node.js server
        target: "http://localhost:3000",
        // Crucial for local proxying
        changeOrigin: true,
        // We no longer need to rewrite the path, as the backend expects '/api/v1'
        // If your backend routes did NOT include '/api/v1', you would rewrite here.
        // For simplicity, we'll keep the path as is, but ensure it's pointing to the correct port.
      },
    },
  },
});
