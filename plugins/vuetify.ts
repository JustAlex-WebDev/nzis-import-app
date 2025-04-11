import { defineNuxtPlugin } from "#app";
import { createVuetify } from "vuetify";
import { md3 } from "vuetify/blueprints";
import { VDateInput } from "vuetify/labs/VDateInput";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

// Import all Vuetify components and directives
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize Vuetify
  const vuetify = createVuetify({
    ssr: true,
    components: {
      ...components,
      VDateInput,
    },
    directives,
    blueprint: md3,
    icons: {
      defaultSet: "mdi",
    },
    locale: {
      locale: "bg",
    },
  });

  // Apply Vuetify
  nuxtApp.vueApp.use(vuetify);
});
