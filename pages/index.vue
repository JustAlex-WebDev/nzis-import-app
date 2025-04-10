<script setup lang="ts">
//
// State
//

// Form state
const form = reactive({
  pid: null as number | null,
});

// Switch
const switchMe = ref(false);

//
// Methods
//

// Validation rule: PID should be exactly 10 digits
const pidValidationRule = (v: string) => {
  // Check if the input contains exactly 10 digits
  const regex = /^\d{10}$/;
  if (!v) {
    return "ЕГН/ЛНЧ не може да бъде празно";
  } else if (!regex.test(v)) {
    return "ЕГН/ЛНЧ трябва да съдържа точно 10 цифри";
  }
  return true;
};

//
// Computed
//

// Computed property for the counter
const counter = computed(() => {
  const length = form.pid ? form.pid.toString().length : 0; // Convert to string and get length
  return length; // Just return the number for the counter
});

//
// Metadata
//

// Set the page's head metadata
useHead({
  link: [{ rel: "icon", type: "image/svg+xml", href: "" }],
  title: "НЗИС Import Application",
  htmlAttrs: {
    lang: "bg",
  },
  meta: [
    {
      name: "description",
      content:
        "НЗИС Import Application е приложение за импортиране на данни за пациенти от Националната здравна информационна система (НЗИС), което позволява лесно извличане на данни и реферали за пациента.",
    },
    {
      name: "keywords",
      content: "НЗИС, пациентски данни, реферали, импортиране, здравеопазване",
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
    class="mx-auto d-flex flex-column w-100 ga-8 px-4 py-4"
  >
    <!-- Actions -->
    <div class="d-flex align-center ga-4">
      <!-- Import -->
      <v-btn
        color="primary"
        rounded="lg"
        variant="outlined"
        prepend-icon="mdi-file-import-outline"
        class="d-flex"
        v-tooltip:bottom="{
          text: 'Импортиране на маркираните направления',
          openDelay: 700,
        }"
      >
        <span class="text-body-2">Импорт</span>
      </v-btn>

      <!-- Print -->
      <v-btn
        color=""
        rounded="lg"
        variant="outlined"
        prepend-icon="mdi-printer-outline"
        class="d-flex"
        v-tooltip:bottom="{
          text: 'Печатане на маркираните направления',
          openDelay: 700,
        }"
      >
        <span class="text-body-2">Печат</span>
      </v-btn>

      <!-- Clear All -->
      <v-btn
        color="error"
        rounded="lg"
        variant="outlined"
        prepend-icon="mdi-close"
        class="d-flex"
        v-tooltip:bottom="{
          text: 'Изчистисване на всички направления',
          openDelay: 700,
        }"
      >
        <span class="text-body-2">Изчисти</span>
      </v-btn>
    </div>

    <!-- Form -->
    <form>
      <v-row class="d-flex flex-wrap" align="stretch" justify="space-between">
        <!-- PID Input -->
        <v-col cols="12">
          <v-number-input
            v-model="form.pid"
            :value="form.pid"
            append-inner-icon="mdi-magnify"
            label="ЕГН/ЛЧН"
            control-variant="hidden"
            maxlength="10"
            variant="outlined"
            placeholder="5303266698"
            density="comfortable"
            rounded="lg"
            hint="Въведете валиден ЕГН/ЛНЧ (само цифри)"
            persistent-hint
            :rules="[pidValidationRule]"
            :counter="counter"
          >
            <!-- PID/HPH Switch -->
            <template v-slot:prepend>
              <v-switch
                v-model="switchMe"
                :hide-details="true"
                style="height: 48px; max-height: 48px"
              >
                <template v-slot:label>ЕГН/ЛЧН</template>
              </v-switch>
            </template></v-number-input
          >
        </v-col>
      </v-row>
    </form>
  </v-container>
</template>
