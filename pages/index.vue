<script setup lang="ts">
//
// Imports
//
import { useDisplay } from "vuetify";

//
// State
//

// Screen size
const { smAndDown } = useDisplay();

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

// Selected references for import
const selectedReferences = ref<Array<string | number>>([]);

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

// Examination Table
const examinationTableItems = [
  {
    code: "00-02A",
    examinationName: "Изследване на витамин D",
  },
];

const examinationTableHeaders = [
  { key: "code", title: "Код", align: "start" as "start" },
  { key: "examinationName", title: "Изследване", align: "start" as "start" },
];

// Performer Select
const performerSelectItems = [
  { name: "Д-р Иванов", department: "Кардиология" },
  { name: "Д-р Петрова", department: "Неврология" },
  { name: "Д-р Георгиев", department: "Ортопедия" },
  { name: "Д-р Стефанова", department: "Педиатрия" },
  { name: "Д-р Николов", department: "Офталмология" },
  { name: "Д-р Димитрова", department: "Хирургия" },
];

//
// Computed Properties
//

// Check if any references are selected
const hasSelectedReferences = computed(
  () => selectedReferences.value.length > 0
);

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

/**
 * Copies the provided text to the clipboard.
 * @param {string} textToCopy - The text to copy to the clipboard.
 */
const copyToClipboard = (textToCopy: string) => {
  if (!textToCopy) {
    console.error("No text provided to copy.");
    alert("Няма текст за копиране.");
    return;
  }

  if (!navigator.clipboard?.writeText) {
    console.error("Clipboard API is not supported in this browser.");
    alert("Клипбордът не е поддържан в този браузър.");
    return;
  }

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      alert("Текстът е успешно копиран в клипборда!");
    })
    .catch((err) => {
      console.error("Failed to copy text to clipboard:", err);
      alert("Неуспешно копиране. Опитайте отново.");
    });
};

// Props for the performer select
const performerSelectProps = (performer: {
  name: string;
  department: string;
}): { title: string; subtitle: string } => {
  return {
    title: performer.name,
    subtitle: performer.department,
  };
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
          :disabled="!hasSelectedReferences"
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
          :disabled="!hasSelectedReferences"
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
            hint="Въведете валиден HPH (цифри и/или букви на кирилица)"
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

    <!-- Divider -->
    <v-divider class="my-6"></v-divider>

    <!-- References -->
    <v-row align="stretch" justify="start" class="flex-0-1">
      <!-- Reference -->
      <v-col cols="12" sm="6" style="height: fit-content">
        <v-card class="bg-white" rounded="lg" flat border>
          <!-- Title -->
          <v-card-title
            class="d-flex bg-grey-lighten-5 justify-space-between align-center px-2 py-0"
          >
            <!-- Import Checkbox -->
            <v-checkbox
              :value="1"
              v-model="selectedReferences"
              :hide-details="true"
              style="scale: 0.8"
              color="primary"
              tabindex="0"
              aria-label="Селектирайте направлението"
              v-tooltip:bottom="{
                text: 'Селектирайте направлението',
                openDelay: 700,
              }"
            ></v-checkbox>

            <!-- PID/HPH -->
            <div class="d-flex align-center ga-1">
              <div class="text-subtitle-2">
                <b> HPH: 1234567890аж </b>
              </div>

              <!-- Copy Button -->
              <div class="relative d-flex align-center">
                <v-btn
                  icon="mdi-content-copy"
                  size="x-small"
                  rounded="circle"
                  variant="text"
                  color=""
                  @click="copyToClipboard('1234567890аж')"
                  tabindex="0"
                  aria-label="Кликнете, за да копирате в клипборда"
                  v-tooltip:bottom="{
                    text: 'Кликнете, за да копирате в клипборда',
                    openDelay: 700,
                  }"
                >
                </v-btn>
              </div>
            </div>

            <!-- Close Icon -->
            <v-btn
              icon="mdi-close"
              color="error"
              size="small"
              variant="text"
              aria-label="Затворете направлението"
              v-tooltip:bottom="{
                text: 'Затворете направлението',
                openDelay: 700,
              }"
            ></v-btn>
          </v-card-title>

          <!-- Divider -->
          <v-divider></v-divider>

          <!-- Content -->
          <v-card-text class="px-4 py-2">
            <!-- Patient -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-account-outline" size="small"></v-icon>

                  <!-- Name -->
                  <b>Велизар Петков Шилев</b>

                  <!-- PID -->
                  <div>1944024426</div>
                </div>
              </template>
            </v-hover>

            <!-- Date -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon
                    icon="mdi-calendar-month-outline"
                    size="small"
                  ></v-icon>

                  <!-- Date -->
                  <div>Изд. <b>09 апр 2025г.</b></div>

                  <!-- List -->
                  <div>(Амб. л-т <b>25099A0000F6</b>)</div>

                  <!-- Type -->
                  <div>вид <b>1</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Location -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-map-marker-outline" size="small"></v-icon>

                  <!-- Practise Location -->
                  <div>Пловдив (<b>16</b>)</div>

                  <!-- Region -->
                  <div>Съединение (<b>15</b>)</div>
                </div>
              </template>
            </v-hover>

            <!-- Condition -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon
                    icon="mdi-clipboard-pulse-outline"
                    size="small"
                  ></v-icon>

                  <!-- Patient's Condition -->
                  <div>ZOO</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-doctor" size="small"></v-icon>

                  <!-- Doctor's Name -->
                  <b>Тодор Николов</b>

                  <!-- Doctor's Identifier -->
                  <div>УИН: <b>1700003565</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Specialty -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-stethoscope" size="small"></v-icon>

                  <!-- Doctor's Specialty -->
                  <div><b>06</b> (Вътрешни болести)</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor's Practise Location -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-hospital-building" size="small"></v-icon>

                  <!-- Doctor's Practise -->
                  <div>РЗИ код: <b>1622111277</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Examination Table -->
            <v-data-table
              :headers="examinationTableHeaders"
              :items="examinationTableItems"
              :mobile="smAndDown"
              :disable-sort="true"
              :hide-default-header="smAndDown"
              hide-default-footer
              density="compact"
              class="bg-white w-100 border my-2 rounded"
            >
              <!-- Head Section -->
              <template
                v-for="header in examinationTableHeaders"
                #[`header.${header.key}`]
                :key="header.key"
              >
                <div
                  class="d-flex align-center font-weight-bold"
                  style="text-wrap-mode: nowrap"
                >
                  <span>{{ header.title }}</span>
                </div>
              </template>

              <!-- Body Section -->
              <!-- Code -->
              <template v-slot:[`item.code`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.code }}</span>
                </div>
              </template>

              <!-- Examination -->
              <template v-slot:[`item.examinationName`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.examinationName }}</span>
                </div>
              </template>
            </v-data-table>

            <!-- Select Performer -->
            <v-select
              :item-props="performerSelectProps"
              :items="performerSelectItems"
              prepend-inner-icon="mdi-hospital-box-outline"
              label="Изпълнител на направлението"
              control-variant="hidden"
              variant="outlined"
              placeholder="Изпълнител на направлението"
              density="compact"
              :hide-details="true"
              rounded="lg"
              class="mt-4"
            ></v-select>

            <!-- Sample Date Input -->
            <v-date-input
              prepend-icon=""
              prepend-inner-icon="mdi-test-tube"
              label="Дата на материал"
              variant="outlined"
              density="compact"
              rounded="lg"
              :hide-details="true"
              class="mt-4"
            ></v-date-input>

            <!-- Result Date Input -->
            <v-date-input
              prepend-icon=""
              prepend-inner-icon="mdi-file-document-arrow-right-outline"
              label="Дата на резултат"
              variant="outlined"
              density="compact"
              rounded="lg"
              :hide-details="true"
              class="mt-4"
            ></v-date-input>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Reference -->
      <v-col cols="12" sm="6" style="height: fit-content">
        <v-card class="bg-white" rounded="lg" flat border>
          <!-- Title -->
          <v-card-title
            class="d-flex bg-grey-lighten-5 justify-space-between align-center px-2 py-0"
          >
            <!-- Import Checkbox -->
            <v-checkbox
              :value="2"
              v-model="selectedReferences"
              :hide-details="true"
              style="scale: 0.8"
              color="primary"
              tabindex="0"
              aria-label="Селектирайте направлението"
              v-tooltip:bottom="{
                text: 'Селектирайте направлението',
                openDelay: 700,
              }"
            ></v-checkbox>

            <!-- PID/HPH -->
            <div class="d-flex align-center ga-1">
              <div class="text-subtitle-2">
                <b> HPH: 1234567890аж </b>
              </div>

              <!-- Copy Button -->
              <div class="relative d-flex align-center">
                <v-btn
                  icon="mdi-content-copy"
                  size="x-small"
                  rounded="circle"
                  variant="text"
                  color=""
                  @click="copyToClipboard('1234567890аж')"
                  tabindex="0"
                  aria-label="Кликнете, за да копирате в клипборда"
                  v-tooltip:bottom="{
                    text: 'Кликнете, за да копирате в клипборда',
                    openDelay: 700,
                  }"
                >
                </v-btn>
              </div>
            </div>

            <!-- Close Icon -->
            <v-btn
              icon="mdi-close"
              color="error"
              size="small"
              variant="text"
              aria-label="Затворете направлението"
              v-tooltip:bottom="{
                text: 'Затворете направлението',
                openDelay: 700,
              }"
            ></v-btn>
          </v-card-title>

          <!-- Divider -->
          <v-divider></v-divider>

          <!-- Content -->
          <v-card-text class="px-4 py-2">
            <!-- Patient -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-account-outline" size="small"></v-icon>

                  <!-- Name -->
                  <b>Иван Кирков Милев</b>

                  <!-- PID -->
                  <div>1234567890</div>
                </div>
              </template>
            </v-hover>

            <!-- Date -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon
                    icon="mdi-calendar-month-outline"
                    size="small"
                  ></v-icon>

                  <!-- Date -->
                  <div>Изд. <b>10 юни 2024г.</b></div>

                  <!-- List -->
                  <div>(Амб. л-т <b>32519A0000F6</b>)</div>

                  <!-- Type -->
                  <div>вид <b>2</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Location -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-map-marker-outline" size="small"></v-icon>

                  <!-- Practise Location -->
                  <div>София (<b>5</b>)</div>

                  <!-- Region -->
                  <div>Студентски (<b>9</b>)</div>
                </div>
              </template>
            </v-hover>

            <!-- Condition -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon
                    icon="mdi-clipboard-pulse-outline"
                    size="small"
                  ></v-icon>

                  <!-- Patient's Condition -->
                  <div>ZOO</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-doctor" size="small"></v-icon>

                  <!-- Doctor's Name -->
                  <b>Никола Тодоров</b>

                  <!-- Doctor's Identifier -->
                  <div>УИН: <b>2300004163</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Specialty -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-stethoscope" size="small"></v-icon>

                  <!-- Doctor's Specialty -->
                  <div><b>06</b> (Вътрешни болести)</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor's Practise Location -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-hospital-building" size="small"></v-icon>

                  <!-- Doctor's Practise -->
                  <div>РЗИ код: <b>2321131225</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Examination Table -->
            <v-data-table
              :headers="examinationTableHeaders"
              :items="examinationTableItems"
              :mobile="smAndDown"
              :disable-sort="true"
              :hide-default-header="smAndDown"
              hide-default-footer
              density="compact"
              class="bg-white w-100 border my-2 rounded"
            >
              <!-- Head Section -->
              <template
                v-for="header in examinationTableHeaders"
                #[`header.${header.key}`]
                :key="header.key"
              >
                <div
                  class="d-flex align-center font-weight-bold"
                  style="text-wrap-mode: nowrap"
                >
                  <span>{{ header.title }}</span>
                </div>
              </template>

              <!-- Body Section -->
              <!-- Code -->
              <template v-slot:[`item.code`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.code }}</span>
                </div>
              </template>

              <!-- Examination -->
              <template v-slot:[`item.examinationName`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.examinationName }}</span>
                </div>
              </template>
            </v-data-table>

            <!-- Select Performer -->
            <v-select
              :item-props="performerSelectProps"
              :items="performerSelectItems"
              prepend-inner-icon="mdi-hospital-box-outline"
              label="Изпълнител на направлението"
              control-variant="hidden"
              variant="outlined"
              placeholder="Изпълнител на направлението"
              density="compact"
              :hide-details="true"
              rounded="lg"
              class="mt-4"
            ></v-select>

            <!-- Sample Date Input -->
            <v-date-input
              prepend-icon=""
              prepend-inner-icon="mdi-test-tube"
              label="Дата на материал"
              variant="outlined"
              density="compact"
              rounded="lg"
              :hide-details="true"
              class="mt-4"
            ></v-date-input>

            <!-- Result Date Input -->
            <v-date-input
              prepend-icon=""
              prepend-inner-icon="mdi-file-document-arrow-right-outline"
              label="Дата на резултат"
              variant="outlined"
              density="compact"
              rounded="lg"
              :hide-details="true"
              class="mt-4"
            ></v-date-input>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Reference -->
      <v-col cols="12" sm="6" style="height: fit-content">
        <v-card class="bg-white" rounded="lg" flat border>
          <!-- Title -->
          <v-card-title
            class="d-flex bg-grey-lighten-5 justify-space-between align-center px-2 py-0"
          >
            <!-- Import Checkbox -->
            <v-checkbox
              :value="3"
              v-model="selectedReferences"
              :hide-details="true"
              style="scale: 0.8"
              color="primary"
              tabindex="0"
              aria-label="Селектирайте направлението"
              v-tooltip:bottom="{
                text: 'Селектирайте направлението',
                openDelay: 700,
              }"
            ></v-checkbox>

            <!-- PID/HPH -->
            <div class="d-flex align-center ga-1">
              <div class="text-subtitle-2">
                <b> HPH: 1234567890аж </b>
              </div>

              <!-- Copy Button -->
              <div class="relative d-flex align-center">
                <v-btn
                  icon="mdi-content-copy"
                  size="x-small"
                  rounded="circle"
                  variant="text"
                  color=""
                  @click="copyToClipboard('1234567890аж')"
                  tabindex="0"
                  aria-label="Кликнете, за да копирате в клипборда"
                  v-tooltip:bottom="{
                    text: 'Кликнете, за да копирате в клипборда',
                    openDelay: 700,
                  }"
                >
                </v-btn>
              </div>
            </div>

            <!-- Close Icon -->
            <v-btn
              icon="mdi-close"
              color="error"
              size="small"
              variant="text"
              aria-label="Затворете направлението"
              v-tooltip:bottom="{
                text: 'Затворете направлението',
                openDelay: 700,
              }"
            ></v-btn>
          </v-card-title>

          <!-- Divider -->
          <v-divider></v-divider>

          <!-- Content -->
          <v-card-text class="px-4 py-2">
            <!-- Patient -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-account-outline" size="small"></v-icon>

                  <!-- Name -->
                  <b>Велизар Петков Шилев</b>

                  <!-- PID -->
                  <div>1944024426</div>
                </div>
              </template>
            </v-hover>

            <!-- Date -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon
                    icon="mdi-calendar-month-outline"
                    size="small"
                  ></v-icon>

                  <!-- Date -->
                  <div>Изд. <b>09 апр 2025г.</b></div>

                  <!-- List -->
                  <div>(Амб. л-т <b>25099A0000F6</b>)</div>

                  <!-- Type -->
                  <div>вид <b>1</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Location -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-map-marker-outline" size="small"></v-icon>

                  <!-- Practise Location -->
                  <div>Пловдив (<b>16</b>)</div>

                  <!-- Region -->
                  <div>Съединение (<b>15</b>)</div>
                </div>
              </template>
            </v-hover>

            <!-- Condition -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon
                    icon="mdi-clipboard-pulse-outline"
                    size="small"
                  ></v-icon>

                  <!-- Patient's Condition -->
                  <div>ZOO</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-doctor" size="small"></v-icon>

                  <!-- Doctor's Name -->
                  <b>Тодор Николов</b>

                  <!-- Doctor's Identifier -->
                  <div>УИН: <b>1700003565</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Specialty -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-stethoscope" size="small"></v-icon>

                  <!-- Doctor's Specialty -->
                  <div><b>06</b> (Вътрешни болести)</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor's Practise Location -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Icon -->
                  <v-icon icon="mdi-hospital-building" size="small"></v-icon>

                  <!-- Doctor's Practise -->
                  <div>РЗИ код: <b>1622111277</b></div>
                </div>
              </template>
            </v-hover>

            <!-- Examination Table -->
            <v-data-table
              :headers="examinationTableHeaders"
              :items="examinationTableItems"
              :mobile="smAndDown"
              :disable-sort="true"
              :hide-default-header="smAndDown"
              hide-default-footer
              density="compact"
              class="bg-white w-100 border my-2 rounded"
            >
              <!-- Head Section -->
              <template
                v-for="header in examinationTableHeaders"
                #[`header.${header.key}`]
                :key="header.key"
              >
                <div
                  class="d-flex align-center font-weight-bold"
                  style="text-wrap-mode: nowrap"
                >
                  <span>{{ header.title }}</span>
                </div>
              </template>

              <!-- Body Section -->
              <!-- Code -->
              <template v-slot:[`item.code`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.code }}</span>
                </div>
              </template>

              <!-- Examination -->
              <template v-slot:[`item.examinationName`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.examinationName }}</span>
                </div>
              </template>
            </v-data-table>

            <!-- Select Performer -->
            <v-select
              :item-props="performerSelectProps"
              :items="performerSelectItems"
              prepend-inner-icon="mdi-hospital-box-outline"
              label="Изпълнител на направлението"
              control-variant="hidden"
              variant="outlined"
              placeholder="Изпълнител на направлението"
              density="compact"
              :hide-details="true"
              rounded="lg"
              class="mt-4"
            ></v-select>

            <!-- Sample Date Input -->
            <v-date-input
              prepend-icon=""
              prepend-inner-icon="mdi-test-tube"
              label="Дата на материал"
              variant="outlined"
              density="compact"
              rounded="lg"
              :hide-details="true"
              class="mt-4"
            ></v-date-input>

            <!-- Result Date Input -->
            <v-date-input
              prepend-icon=""
              prepend-inner-icon="mdi-file-document-arrow-right-outline"
              label="Дата на резултат"
              variant="outlined"
              density="compact"
              rounded="lg"
              :hide-details="true"
              class="mt-4"
            ></v-date-input>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-menu > .v-overlay__content > .v-list,
.v-menu > .v-overlay__content > .v-sheet {
  background: white !important;
}
</style>
