import { defineConfig } from "vitest/config";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import topLevelAwait from "vite-plugin-top-level-await";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    exclude: ["**/node_modules/**", "**/e2e/**"],
    reporters: process.env.CI ? ["verbose", "junit"] : ["verbose"],
    outputFile: {
      junit: "test-results/junit.xml",
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: "remote-lib",
      filename: "remoteEntry.js",
      // Modules to exposed
      exposes: {
        "./Confirm": "./src/components/Confirm.vue",
        "./apiClient": "./src/services/apiClient.ts",
        "./types": "./src/types/index.ts",
      },
      shared: {
        vue: { generate: false, import: false },
        pinia: { generate: false, import: false },
        primevue: { generate: false, import: false },
        axios: { generate: false, import: false },
      },
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        minifyInternalExports: false,
      },
    },
  },
  server: {
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
  },
});

