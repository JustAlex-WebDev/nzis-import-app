// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // Add CSS files for global styles
  css: ["vuetify/styles", "@/assets/styles/main.scss"],

  // Transpile Vuetify for SSR
  build: {
    transpile: ["vuetify"],
  },

  // Vite configuration for debugging and resolving aliases
  vite: {
    define: {
      "process.env.DEBUG": false,
    },

    build: {
      minify: "terser",
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },

  // Enable source maps for debugging purposes on both server and client
  sourcemap: {
    server: false,
    client: true,
  },

  // SSR and Nitro configurations for performance
  ssr: true,
  nitro: {
    compressPublicAssets: true,
    debug: false,
  },
});
