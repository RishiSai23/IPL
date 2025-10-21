// file: vite.config.ts
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
    // THIS IS THE FIX FOR CORS
    proxy: {
      // When the app requests anything starting with /api
      "/api": {
        // Redirect the request to the target API endpoint
        target: "https://api.football-data.org",
        // Change the origin of the host header to the target URL
        changeOrigin: true,
        // Rewrite the path: /api/v4/xyz becomes /v4/xyz before sending to target
        // (You might need this depending on how you structure your API calls)
        rewrite: (path) => path.replace(/^\/api/, ""),
        // Important: Ensure you set the X-Auth-Token header here or in your Axios config
      },
    },
  },
});
