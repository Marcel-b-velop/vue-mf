<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { FilterMatchMode } from "@primevue/core";
import { Filiale } from "@/stores/optionsStore.ts";
import {
  UiOption,
  Werberegionen,
  useOptionsStore,
} from "@/stores/optionsStore.ts";
import { useI18n } from "vue-i18n";
import { useMessageService } from "@/services/messageService.ts";
import { useFiliallistenService } from "@/services/filiallistenService";

const { t } = useI18n();
const visible = defineModel<boolean>("visible", { required: true });
const selection = defineModel<string[]>({ default: () => [] });

const emit = defineEmits<{
  (e: "onClose"): void;
  (e: "onAdd", payload: string[]): void;
}>();

const onHide = () => {
  visible.value = false;
  emit("onClose");
};

const onSave = () => {
  emit("onAdd", [...currentSelected.value.map((x) => x.nummer)]);
  visible.value = false;
};

const optionsStore = useOptionsStore();
const messageService = useMessageService();
const filiallistenService = useFiliallistenService();
const werberegionen = ref<UiOption[]>([]);
const filialen = ref<Filiale[]>([]);
const primaryLoading = ref<boolean>(true);
const isLoading = ref<boolean>(false);

onMounted(() => {
  if (!optionsStore.werberegionLoaded) {
    filiallistenService
      .holeWerberegionenGruppiert()
      .then((dto: Werberegionen) => {
        optionsStore.initWerberegionen(dto);
      })
      .catch((e) => {
        console.error(e);
        messageService.showError(t("benachrichtigung.fehler.allgemein"));
      })
      .finally(() => {
        primaryLoading.value = false;
      });
    primaryLoading.value = true;
  }
  if (!optionsStore.filialenLoaded) {
    filiallistenService
      .holeFilialen()
      .then((dto: Filiale[]) => {
        optionsStore.initFilialen(dto);
      })
      .catch((e) => {
        console.error(e);
        messageService.showError(t("benachrichtigung.fehler.allgemein"));
      });
  }
});

const currentSelected = ref<Filiale[]>([]);
const filtersAnzeige = ref();
const filters = ref();

const filialFilterDisplay = ref<string | null>(null);
const filialAnzeigeFilterDisplay = ref<string | null>(null);

const initFilters = () => {
  filters.value = {
    filiale: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    werberegion: {
      value: null,
      matchMode: FilterMatchMode.IN,
    },
  };

  filtersAnzeige.value = {
    filiale: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    werberegion: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  };
};

initFilters();

const updateFilialFilter = useDebounceFn((value: string | null) => {
  filters.value.filiale.value = value;
}, 300);

const updateFilialAnzeigeFilter = useDebounceFn((value: string | null) => {
  filtersAnzeige.value.filiale.value = value;
}, 300);

watch(filialFilterDisplay, (newValue) => {
  updateFilialFilter(newValue);
});

watch(filialAnzeigeFilterDisplay, (newValue) => {
  updateFilialAnzeigeFilter(newValue);
});

const removeAll = () => {
  currentSelected.value = [];
};

const checked = computed(() => currentSelected.value.length > 0);

const removeData = (data: Filiale) => {
  currentSelected.value = currentSelected.value.filter(
    (item) => item.nummer !== data.nummer
  );
};

// const auswahlSpeichern = () => {
//   if (pbPromotionStore.dialogState.filialenDialogCallback) {
//     pbPromotionStore.dialogState.filialenDialogCallback(currentSelected.value);
//   } else {
//     console.error("Kein Callback vorhanden.");
//     messageService.showError(t("benachrichtigung.fehler.allgemein"));
//   }
// };

// watch(
//   () => pbPromotionStore.dialogState.showFilialenDialog,
//   (value: boolean) => {
//     if (value) {
//       const ids = formStore.selectedFilialen?.map((x: Filiale) => x.nummer);
//       currentSelected.value = filialen.value.filter((x: Filiale) =>
//         ids.includes(x.nummer)
//       );
//     }
//   }
watch(
  () => visible.value,
  (value: boolean) => {
    if (value) {
      primaryLoading.value = true;
      werberegionen.value = optionsStore.werberegionen;
      filialen.value = optionsStore.filialen;
      currentSelected.value = filialen.value.find((x) =>
        selection.value.includes(x.nummer)
      )
        ? filialen.value.filter((x) => selection.value.includes(x.nummer))
        : [];
      primaryLoading.value = false;
    }
  }
);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :style="{ 'min-width': '1300px', width: '40vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    draggable
    :loading="isLoading"
    maximizable>
    <template #header>
      <h1>{{ t("filiale", 2) }}</h1>
    </template>
    <div class="ncp-dialog-content">
      <div class="flex gap-2 flex-wrap">
        <div class="flex-1">
          <h2 class="text-left">{{ t("suche") }}</h2>
          <DataTable
            v-model:filters="filters"
            :value="filialen"
            :loading="isLoading"
            v-model:selection="currentSelected"
            paginator
            scrollable
            sort-field="nummer"
            :sort-order="1"
            :rows="15"
            :rows-per-page-options="[10, 15, 50]"
            edit-mode="cell"
            dataKey="nummer"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport"
            current-page-report-template="{first} - {last} von {totalRecords}"
            striped-rows
            show-gridlines>
            <template #loadingicon> <ProgressSpinner /> </template>
            <template #header>
              <div class="flex flex-wrap gap-3">
                <div>
                  <InputGroup>
                    <InputText
                      id="suche-filiale"
                      :placeholder="t('filiale')"
                      class="w-60"
                      v-model="filialFilterDisplay" />
                    <Button
                      :icon="
                        filialFilterDisplay
                          ? 'pi pi-filter-slash'
                          : 'pi pi-filter'
                      "
                      @click="filialFilterDisplay = null" />
                  </InputGroup>
                </div>
                <MultiSelect
                  id="suche-werberegionen"
                  v-model="filters.werberegion.value"
                  :options="werberegionen"
                  :virtual-scroller-options="{ itemSize: 26 }"
                  placeholder="Werberegionen"
                  option-label="name"
                  filter
                  option-value="name"
                  show-clear
                  class="w-80" />
              </div>
            </template>
            <Column field="filiale" header="Filiale" />
            <Column
              field="werberegion"
              header="Werberegionen"
              header-class="w-80" />
            <Column selectionMode="multiple" header-class="w-12" />
          </DataTable>
        </div>
        <div class="flex-1">
          <h2 class="text-left">{{ t("auswahl") }}</h2>
          <DataTable
            filterDisplay="menu"
            :value="currentSelected"
            v-model:selection="currentSelected"
            v-model:filters="filtersAnzeige"
            paginator
            scrollable
            sort-field="nummer"
            :sort-order="1"
            :rows="10"
            :rows-per-page-options="[10, 50, 100]"
            edit-mode="cell"
            dataKey="nummer"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks  NextPageLink LastPageLink CurrentPageReport"
            current-page-report-template="{first} - {last} von {totalRecords}"
            striped-rows
            show-gridlines>
            <template #header>
              <div class="flex flex-wrap gap-4">
                <div>
                  <InputGroup>
                    <InputText
                      id="name"
                      class="w-60"
                      :placeholder="t('filiale')"
                      v-model="filialAnzeigeFilterDisplay" />
                    <Button
                      :icon="
                        filialAnzeigeFilterDisplay
                          ? 'pi pi-filter-slash'
                          : 'pi pi-filter'
                      "
                      @click="filialAnzeigeFilterDisplay = null" />
                  </InputGroup>
                </div>
                <Select
                  id="anzeige-primary"
                  v-model="filtersAnzeige.werberegion.value"
                  :options="werberegionen"
                  :loading="primaryLoading"
                  :virtual-scroller-options="{ itemSize: 26 }"
                  :placeholder="t('werberegion', 2)"
                  option-label="name"
                  filter
                  option-value="name"
                  show-clear
                  class="w-80" />
              </div>
            </template>
            <Column header-class="w-12">
              <template #header>
                <Checkbox
                  :binary="true"
                  v-model="checked"
                  @change="removeAll" />
              </template>
              <template #body="{ data }">
                <Checkbox
                  :binary="true"
                  v-model="checked"
                  @change="removeData(data)" />
              </template>
            </Column>
            <Column field="filiale" header="Filiale" />
            <Column
              field="werberegion"
              header="Werberegionen"
              header-class="w-80" />
          </DataTable>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Auswahl hinzufügen" icon="pi pi-check" @click="onSave" />
      <Button
        label="Schließen"
        @click="onHide"
        icon="pi pi-times"
        severity="secondary" />
    </template>
  </Dialog>
</template>

<style scoped lang="css">
.ncp-dialog-content {
  height: 70vh;
}
</style>
