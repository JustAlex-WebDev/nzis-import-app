<script setup lang="ts">
//
// Metadata
//

// Set the page's head metadata
useHead({
  link: [{ rel: "icon", type: "image/svg+xml", href: "" }],
  title: "Импорт от НЗИК",
  htmlAttrs: {
    lang: "bg",
  },
  meta: [
    {
      name: "description",
      content:
        "A comprehensive platform for managing medical laboratory operations, patient data, and test results.",
    },
    {
      name: "keywords",
      content: "medical laboratory, patient data, test results, healthcare",
    },
    { name: "author", content: "SKYWARE Group | LIMS iLab" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
});
</script>

<template>
  <v-container
    max-width="1024"
    height="100%"
    class="mx-auto d-flex flex-column w-100 ga-12 px-4 py-4"
  >
    <!-- Hero Section -->
    <div class="px-2 d-flex flex-column flex-md-row ga-8 justify-between">
      <div class="d-flex flex-column ga-4 w-md-50 w-100">
        <div class="d-flex flex-column ga-6">
          <div class="d-flex flex-column ga-6">
            <!-- Title -->
            <span class="text-h2 font-weight-bold"> Title </span>

            <!-- Subtitle -->
            <span class="text-h5">Subtitle</span>
          </div>

          <!-- Messages -->
          <div class="d-flex flex-column ga-1">
            <!-- Message update in progress -->
            <span class="text-subtitle-1"> Message update in progress </span>

            <!-- Message thanks -->
            <span class="text-subtitle-1 mt-n1"> Message thanks </span>
          </div>
        </div>

        <div class="d-flex flex-column ga-1">
          <!-- Availability -->
          <span class="text-subtitle-1">
            <!-- Availability label -->
            Availability label

            <!-- Availability time -->
            <span class="font-weight-bold">01:02:42</span>
          </span>

          <!-- Socials -->
          <span class="text-subtitle-2 d-flex flex-column flex-wrap ga-2">
            <!-- Social prompt -->
            <span>Social prompt</span>

            <div class="d-flex align-center ga-2">
              <!-- Website -->
              <a
                href="https://skyware-group.com/"
                target="_blank"
                class="text-black font-weight-bold d-flex align-center ga-1 text-decoration-none"
              >
                <!-- Icon -->
                <v-icon icon="mdi-link-variant" size="small"></v-icon>
              </a>

              <!-- X -->
              <a
                href="https://twitter.com/skyware_group"
                target="_blank"
                class="text-black font-weight-bold d-flex align-center ga-1 text-decoration-none"
              >
                <!-- Icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 30 30"
                >
                  <path
                    d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"
                  ></path>
                </svg>
              </a>

              <!-- Facebook -->
              <a
                href="https://www.facebook.com/SkywareGroup/"
                target="_blank"
                class="text-black font-weight-bold d-flex align-center ga-1 text-decoration-none"
              >
                <!-- Icon -->
                <v-icon icon="mdi-facebook" size="large"></v-icon>
              </a>

              <!-- LinkedIn -->
              <a
                href="https://www.linkedin.com/company/skyware-group/"
                target="_blank"
                class="text-black font-weight-bold d-flex align-center ga-1 text-decoration-none"
              >
                <!-- Icon -->
                <v-icon icon="mdi-linkedin" size="large"></v-icon>
              </a>

              <!-- YouTube -->
              <a
                href="https://www.youtube.com/channel/UCXWyTBjecTaKMn904_gc0EA"
                target="_blank"
                class="text-black font-weight-bold d-flex align-center ga-1 text-decoration-none"
              >
                <!-- Icon -->
                <v-icon icon="mdi-youtube" size="x-large"></v-icon>
              </a>
            </div>
          </span>
        </div>
      </div>
    </div>
  </v-container>
</template>
