import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // Native Vite 8 feature
    alias: {
      uuid: path.resolve(__dirname, "node_modules/uuid"),
      "date-fns": path.resolve(__dirname, "node_modules/date-fns"),
    },
    // Force Vite to use the web project's version of these libraries
    dedupe: ["uuid", "date-fns"],
  },
  optimizeDeps: {
    // 1. Force Vite to pre-bundle these so they are available to the browser
    include: ["uuid", "date-fns"],
  },
  server: {
    open: true,
    fs: {
      // 2. Allow Vite to serve files from the shared folder in the parent directory
      allow: [".."],
    },
  },
  plugins: [react(), svgrPlugin()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
