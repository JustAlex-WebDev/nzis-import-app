// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // Add CSS files for global styles
  css: ["vuetify/styles", "@/assets/styles/main.scss"],

  // Transpile Vuetify for SSR
  build: {
    transpile: ["vuetify"],
  },

  // Nuxt Modules
  modules: ["@vite-pwa/nuxt"],

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
    debug: true,
    preset: "cloudflare-pages",
  },

  // PWA configuration
  pwa: {
    registerType: "autoUpdate",

    // Manifest configuration for PWA
    manifest: {
      name: "NZIS Import Application",
      short_name: "NZIS Import",
      description:
        "Streamline patient data import and referral management from the National Health Information System.",
      icons: [
        {
          src: "/images/app-logo-144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/images/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/images/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },

    // Workbox configuration for caching and offline support
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },

    // Client-specific settings for PWA behavior
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 60,
    },

    // Development options for PWA
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
