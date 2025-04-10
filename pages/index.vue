<script setup lang="ts">
//
// State
//

// Form state
const form = reactive({
  pid: null as number | null,
  hph: null as string | null,
  location: null as string | null,
  saleSchema: null as string | null,
});

// Identifier Type Switch (true for PID, false for HPH)
const identifierType = ref<boolean>(true);

// Form ref for validation
const formRef = ref();

// Loading state
const isLoading = ref(false);

// Location list items
const locationItems = [
  "Асеновград",
  "Търново",
  "София",
  "Пловдив",
  "Плевен",
  "Хасково",
];

// Sale schema list items
const saleSchemaItems = ["НЗОК - Асеновград", "НЗОК - Пловдив", "НЗОК - София"];

//
// Methods
//

// Validation rule for PID
const pidValidationRule = (v: string) => {
  const regex = /^\d{10}$/;
  if (!v) {
    return "ЕГН/ЛНЧ не може да бъде празно";
  } else if (!regex.test(v)) {
    return "ЕГН/ЛНЧ трябва да съдържа точно 10 цифри";
  }
  return true;
};

// Validation rule for HPH
const hphValidationRule = (v: string) => {
  const regex = /^[0-9А-Яа-я]{12}$/; // Ensure exactly 12 characters: numbers or Cyrillic letters
  if (!v) {
    return "HPH не може да бъде празно";
  } else if (!regex.test(v)) {
    return "HPH трябва да съдържа точно 12 символа (цифри и/или букви на кирилица)";
  }
  return true;
};

//
// Methods
//

// Validate form fields
const validateForm = () => {
  const pidValid = identifierType.value
    ? pidValidationRule(form.pid?.toString() || "") === true
    : hphValidationRule(form.hph?.toString() || "") === true;

  if (!pidValid) {
    console.error("Invalid PID/HPH");
  }

  return pidValid;
};

// Handle form submission
const handleSubmit = async () => {
  if (validateForm()) {
    // Start loading
    isLoading.value = true;

    // Simulate a 1-second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Form submitted:", {
      ...form,
      identifierType: identifierType.value ? "PID" : "HPH",
    });

    // Stop loading
    isLoading.value = false;
  } else {
    console.log("Form validation failed.");
  }
};

//
// Computed
//

// Computed property for the counter
const counter = computed(() => {
  // Convert to string and get length
  const length = form.pid ? form.pid.toString().length : 0;
  return length;
});

//
// On component mount
//

// Set default location to the first item in the list when the component is mounted
onMounted(() => {
  form.location = form.location || locationItems[0];
  form.saleSchema = form.saleSchema || saleSchemaItems[0];
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
    class="w-100 mx-auto d-flex flex-column ga-4 px-4 py-8"
  >
    <!-- Loading Overlay -->
    <v-overlay
      :model-value="isLoading"
      z-index="50"
      color="rgba(0, 0, 0, 0.5)"
      class="align-center justify-center"
    >
      <v-progress-circular
        indeterminate
        color="white"
        size="50"
      ></v-progress-circular>
    </v-overlay>

    <!-- Actions -->
    <div
      class="d-flex flex-wrap flex-md-row flex-column-reverse align-start align-md-center justify-space-between ga-4"
    >
      <!-- PID/HPH Switch -->
      <div class="d-flex align-center ga-4">
        <span>Търсете направления по</span>
        <v-switch
          v-model="identifierType"
          :hide-details="true"
          color="primary"
          :label="identifierType ? 'ЕГН/ЛЧН' : 'HPH'"
        >
          <template v-slot:label>
            {{ identifierType ? "ЕГН/ЛЧН" : "HPH" }}
          </template>
        </v-switch>
      </div>

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
    </div>

    <!-- Form -->
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-row class="d-flex flex-wrap" align="stretch" justify="space-between">
        <!-- PID/HPH Inputs -->
        <v-col cols="12">
          <!-- PID Input -->
          <v-number-input
            v-if="identifierType"
            v-model="form.pid"
            :value="form.pid"
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
            @keydown.enter="handleSubmit"
          >
            <!-- Search Action -->
            <template v-slot:append-inner>
              <v-tooltip>
                <template v-slot:activator="{ props }">
                  <v-icon
                    class="cursor-pointer"
                    v-bind="props"
                    @click="handleSubmit"
                  >
                    mdi-magnify
                  </v-icon>
                </template>

                <!-- Tooltip -->
                <span>Търсене</span>
              </v-tooltip>
            </template>
          </v-number-input>

          <!-- HPH Input -->
          <v-text-field
            v-else
            v-model="form.hph"
            :value="form.hph"
            label="HPH"
            type="text"
            maxlength="12"
            variant="outlined"
            placeholder="5АГ30326ПВ98"
            density="comfortable"
            rounded="lg"
            hint="Въведете валиден HPH"
            persistent-hint
            :rules="[hphValidationRule]"
            :counter="counter"
            @keydown.enter="handleSubmit"
          >
            <!-- Search Action -->
            <template v-slot:append-inner>
              <v-tooltip>
                <template v-slot:activator="{ props }">
                  <v-icon
                    class="cursor-pointer"
                    v-bind="props"
                    @click="handleSubmit"
                  >
                    mdi-magnify
                  </v-icon>
                </template>

                <!-- Tooltip -->
                <span>Търсене</span>
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>

        <!-- Sale Schema Select -->
        <v-col cols="12" md="6">
          <v-select
            v-model="form.saleSchema"
            :value="form.saleSchema"
            :items="saleSchemaItems"
            prepend-inner-icon="mdi-currency-eur"
            label="Изберете схема на продажба"
            control-variant="hidden"
            maxlength="10"
            variant="outlined"
            placeholder="Схема на продажба"
            density="comfortable"
            rounded="lg"
            hint="Изберете схема на продажба от списъка."
            persistent-hint
          >
          </v-select>
        </v-col>

        <!-- Location Select -->
        <v-col cols="12" md="6">
          <v-select
            v-model="form.location"
            :value="form.location"
            :items="locationItems"
            prepend-inner-icon="mdi-map-marker-outline"
            label="Изберете местоположение"
            control-variant="hidden"
            maxlength="10"
            variant="outlined"
            placeholder="Местоположение"
            density="comfortable"
            rounded="lg"
            hint="Изберете местоположение от списъка."
            persistent-hint
          >
          </v-select>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
