<script setup lang="ts">
//
// Imports
//
import { useDisplay } from "vuetify";
import { mockReferences, type Reference } from "@/data/references";

//
// State
//

// Screen size utility from Vuetify
const { smAndDown } = useDisplay();

// Reactive form state
const form = reactive({
  pid: null as number | null,
  hph: null as string | null,
  location: null as string | null,
  saleSchema: null as string | null,
});

// Boolean switch for identifier type (true = PID, false = HPH)
const identifierType = ref<boolean>(true);

// Form reference for validation
const formRef = ref();

// Loading state for asynchronous operations
const isLoading = ref(false);

// References data
const references = ref<Reference[]>([]);

// Selected references by the user
const selectedReferences = ref<Array<string | number>>([]);

// Location options
const locationItems = [
  "Асеновград",
  "Търново",
  "София",
  "Пловдив",
  "Плевен",
  "Хасково",
];

// Sale schema options
const saleSchemaItems = ["НЗОК - Асеновград", "НЗОК - Пловдив", "НЗОК - София"];

// Performer select options
const performerSelectItems = [
  { name: "Д-р Иванов", department: "Кардиология" },
  { name: "Д-р Петрова", department: "Неврология" },
  { name: "Д-р Георгиев", department: "Ортопедия" },
  { name: "Д-р Стефанова", department: "Педиатрия" },
  { name: "Д-р Николов", department: "Офталмология" },
  { name: "Д-р Димитрова", department: "Хирургия" },
];

// Examination table data
const examinationTableHeaders = [
  { key: "code", title: "Код", align: "start" as "start" },
  { key: "examinationName", title: "Изследване", align: "start" as "start" },
];
const examinationTableItems = [
  { code: "00-02A", examinationName: "Изследване на витамин D" },
];

//
// Computed Properties
//

// Check if any references are selected
const hasSelectedReferences = computed(
  () => selectedReferences.value.length > 0
);

// PID/HPH input character counter
const counter = computed(() => form.pid?.toString().length || 0);

//
// Methods
//

/**
 * Validation rule for PID input.
 */
const pidValidationRule = (value: string) => {
  const regex = /^\d{10}$/;
  if (!value) {
    return "ЕГН/ЛНЧ не може да бъде празно";
  } else if (!regex.test(value)) {
    return "ЕГН/ЛНЧ трябва да съдържа точно 10 цифри";
  }
  return true;
};

/**
 * Validation rule for HPH input.
 */
const hphValidationRule = (value: string) => {
  // Ensure exactly 12 characters: numbers or Cyrillic letters
  const regex = /^[0-9А-Яа-я]{12}$/;

  if (!value) {
    return "HPH не може да бъде празно";
  } else if (!regex.test(value)) {
    return "HPH трябва да съдържа точно 12 символа (цифри и/или букви на кирилица)";
  }
  return true;
};

/**
 * Format a date string to a localized format.
 */
const formatIssuedDate = (dateString: string): string => {
  const months = [
    "яну",
    "фев",
    "мар",
    "апр",
    "май",
    "юни",
    "юли",
    "авг",
    "сеп",
    "окт",
    "ное",
    "дек",
  ];
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")} ${
    months[date.getMonth()]
  } ${date.getFullYear()}г.`;
};

/**
 * Validate the form based on the identifier type.
 */
const validateForm = () => {
  const value = identifierType.value
    ? pidValidationRule(form.pid?.toString() || "")
    : hphValidationRule(form.hph?.toString() || "");
  return value === true;
};

/**
 * Fetch mock references (simulate an API call).
 */
const fetchMockReferences = async (): Promise<Reference[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReferences), 1000);
  });
};

// Clear all references
const clearAllReferences = () => {
  references.value = [];
};

// Remove a reference from the list
const removeReference = (reference: Reference) => {
  references.value = references.value.filter((ref) => ref !== reference);
};

/**
 * Handle form submission.
 */
const handleSubmit = async () => {
  if (validateForm()) {
    isLoading.value = true;
    references.value = await fetchMockReferences();
    isLoading.value = false;

    if (references.value.length === 0) {
      console.log("No references found for the given identifier.");
    }
  } else {
    console.log("Form validation failed.");
  }
};

/**
 * Copy text to clipboard.
 */
const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => console.log("Text copied to clipboard"))
    .catch((error) => {
      console.error("Failed to copy text:", error);
      alert("Unable to copy text.");
    });
};

/**
 * Map performer data to props for a select component.
 */
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
// Lifecycle Hooks
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
  title: "НЗИС Import Application",
  htmlAttrs: { lang: "bg" },
  meta: [
    {
      name: "description",
      content: "Приложение за импортиране на данни от НЗИС.",
    },
    {
      name: "keywords",
      content: "НЗИС, пациентски данни, реферали, импортиране",
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
          @click="clearAllReferences"
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
    <v-row
      v-if="references.length > 0"
      align="stretch"
      justify="start"
      class="flex-0-1"
    >
      <!-- Reference Card Section -->
      <v-col
        v-for="reference in references"
        :key="reference.id"
        cols="12"
        sm="6"
        style="height: fit-content"
      >
        <!-- Card Container for each reference -->
        <v-card class="bg-white" rounded="lg" flat border>
          <!-- Card Header: Title Section -->
          <v-card-title
            class="d-flex bg-grey-lighten-5 justify-space-between align-center px-2 py-0"
          >
            <!-- Checkbox to select the reference -->
            <v-checkbox
              :value="reference.id"
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

            <!-- Section showing HPH (Health Patient ID) -->
            <div class="d-flex align-center ga-1">
              <div class="text-subtitle-2">
                <b> HPH: {{ reference.hph }} </b>
              </div>

              <!-- Button to copy HPH to clipboard -->
              <div class="relative d-flex align-center">
                <v-btn
                  icon="mdi-content-copy"
                  size="x-small"
                  rounded="circle"
                  variant="text"
                  color=""
                  @click="copyToClipboard(reference.hph)"
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

            <!-- Close Button: Allows user to close the reference -->
            <v-btn
              @click="removeReference(reference)"
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

          <!-- Divider between Header and Card Body -->
          <v-divider></v-divider>

          <!-- Card Body: Content Section for each reference -->
          <v-card-text class="px-4 py-2">
            <!-- Patient Information Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Patient Icon -->
                  <v-icon icon="mdi-account-outline" size="small"></v-icon>

                  <!-- Patient's Name -->
                  <b>{{ reference.patientName }}</b>

                  <!-- Patient's PID (Personal Identification Number) -->
                  <div>{{ reference.patientPid }}</div>
                </div>
              </template>
            </v-hover>

            <!-- Date Information Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Date Icon -->
                  <v-icon
                    icon="mdi-calendar-month-outline"
                    size="small"
                  ></v-icon>

                  <!-- Issued Date -->
                  <div>
                    Изд. <b>{{ formatIssuedDate(reference.issuedDate) }}</b>
                  </div>

                  <!-- Reference List -->
                  <div>
                    (Амб. л-т
                    <b>{{ reference.referenceId }}</b>
                    )
                  </div>

                  <!-- Reference Type -->
                  <div>
                    вид <b>{{ reference.referenceType }}</b>
                  </div>
                </div>
              </template>
            </v-hover>

            <!-- Location Information Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Location Icon -->
                  <v-icon icon="mdi-map-marker-outline" size="small"></v-icon>

                  <!-- Primary Location and Code -->
                  <div>
                    {{ reference.primaryLocation }}
                    (
                    <b>{{ reference.primaryLocationCode }}</b>
                    )
                  </div>

                  <!-- Secondary Location and Code -->
                  <div>
                    {{ reference.secondaryLocation }}
                    (
                    <b>{{ reference.secondaryLocationCode }}</b>
                    )
                  </div>
                </div>
              </template>
            </v-hover>

            <!-- Condition Information Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Condition Icon -->
                  <v-icon
                    icon="mdi-clipboard-pulse-outline"
                    size="small"
                  ></v-icon>

                  <!-- Patient's Condition -->
                  <div>{{ reference.patientStateCode }}</div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor Information Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Doctor Icon -->
                  <v-icon icon="mdi-doctor" size="small"></v-icon>

                  <!-- Referring Doctor's Name -->
                  <b>{{ reference.referringDoctor }}</b>

                  <!-- Doctor's Identifier -->
                  <div>
                    УИН: <b>{{ reference.doctorId }}</b>
                  </div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor's Specialty Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Specialty Icon -->
                  <v-icon icon="mdi-stethoscope" size="small"></v-icon>

                  <!-- Doctor's Specialty Information -->
                  <div>
                    <b>{{ reference.conditionCode }}</b> ({{
                      reference.conditionDescription
                    }})
                  </div>
                </div>
              </template>
            </v-hover>

            <!-- Doctor's Practise Location Section -->
            <v-hover>
              <template #default="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="d-flex flex-wrap align-center ga-2 rounded pa-2"
                  :class="{ 'bg-grey-lighten-5': isHovering }"
                >
                  <!-- Practise Location Icon -->
                  <v-icon icon="mdi-hospital-building" size="small"></v-icon>

                  <!-- Regional Health Code -->
                  <div>
                    РЗИ код: <b>{{ reference.regionalHealthCode }}</b>
                  </div>
                </div>
              </template>
            </v-hover>

            <!-- Examination Table Section -->
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
              <!-- Table Headers -->
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

              <!-- Table Body -->
              <!-- Displaying Examination Code -->
              <template v-slot:[`item.code`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.code }}</span>
                </div>
              </template>

              <!-- Displaying Examination Name -->
              <template v-slot:[`item.examinationName`]="{ item }">
                <div
                  class="d-flex align-center ga-0"
                  :class="smAndDown ? 'justify-end' : 'justify-start'"
                >
                  <span>{{ item.examinationName }}</span>
                </div>
              </template>
            </v-data-table>

            <!-- Performer Select Dropdown -->
            <v-select
              :item-props="performerSelectProps"
              :items="performerSelectItems"
              item-value="name"
              item-text="name"
              v-model="reference.executorName"
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
              v-model="reference.materialCollectionDate"
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
              v-model="reference.resultDate"
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
