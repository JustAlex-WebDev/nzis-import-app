<script setup lang="ts"></script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app class="bg-white py-0 px-4 border-thin">
      <div class="d-flex w-100 justify-space-between align-center">
        <div class="d-flex align-center ga-4">
          <!-- Icon -->
          <v-icon icon="mdi-cloud-arrow-right-outline" size="large"></v-icon>

          <!-- Text -->
          <span class="text-h6 font-weight-bold">Импорт от НЗИС</span>
        </div>

        <div class="opacity-50">
          <v-img
            src="images/branding-nzis.svg"
            alt="SKYWARE Group Logo"
            height="40"
            width="160"
            loading="lazy"
          ></v-img>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <!-- Footer -->
    <v-footer app class="bg-white d-flex align-center ga-2 border-thin">
      <div class="d-flex align-center ga-2">
        <!-- Icon -->
        <v-icon icon="mdi-information-outline" size="small"></v-icon>

        <!-- Text -->
        <span class="text-body-2 font-weight-bold"
          >Използва се Рила сървър</span
        >
      </div>
    </v-footer>
  </v-app>
</template>

<style>
.v-img__img {
  width: auto !important;
}
</style>
