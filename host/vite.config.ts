import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    federation({
      name: 'host-app',
      filename: 'remoteEntry.js',
      // Modules to expose
      remotes: {
        'remote-app1': 'http://localhost:5174/assets/remoteEntry.js',
        'remote-app2': 'http://localhost:5175/assets/remoteEntry.js',
        'remote-lib': 'http://localhost:5177/assets/remoteEntry.js',
        'remote-wichteln': 'http://localhost:5176/assets/remoteEntry.js',
      },
      shared: {
        vue: { modulePreload: true },
        pinia: { modulePreload: true },
        primevue: { requiredVersion: '^4.1.1', version: '^4.1.1', modulePreload: true },
        axios: { modulePreload: true },
        'vee-validate': { modulePreload: true, version: '^4.5.1', requiredVersion: '^4.5.1' },
        'vue-router': { modulePreload: true },
        yup: { modulePreload: true },
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1_900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('primevue')) {
            return 'primevue'
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
})
