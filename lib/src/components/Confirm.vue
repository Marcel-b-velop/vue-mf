<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { DataTable, Column } from "primevue";
import { type ConfirmData, useConfirmStore } from "../stores/confirmStore";
import { onMounted, ref, watch } from "vue";
import { apiClient } from "../services/apiClient";

const emit = defineEmits<{ (e: "closed"): void; (e: "saved", payload: ConfirmData[]): void }>();

const onHide = () => emit("closed");

const onSave = () => {
  emit("saved", selectedCustomers.value);
  selection.value = selectedCustomers.value.map((item) => String(item.id));
  visible.value = false;
};

const visible = defineModel<boolean>("visible", { required: true });
const selection = defineModel<string[]>({ default: () => [] });
const store = useConfirmStore();
const selectedCustomers = ref<ConfirmData[]>([]);

const applyPreselection = () => {
  if (selection.value.length > 0 && store.data.length > 0) {
    selectedCustomers.value = store.data.filter((item) =>
      selection.value.includes(String(item.id))
    );
  }
};

onMounted(async () => {
  const data = await apiClient.get<ConfirmData[]>("/");
  store.setData(data);
  applyPreselection();
});

watch(selection, () => {
  applyPreselection();
});
</script>

<template>
  <Dialog @hide="onHide" v-model:visible="visible" modal header="Daten" :style="{ width: '25rem' }">
    <div>
      <DataTable :value="store.data" v-model:selection="selectedCustomers" data-key="id">
        <template #empty> No customers found. </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        <Column field="id" header="Id" />
        <Column field="name" header="Name" />
      </DataTable>
      <div class="flex justify-end gap-3">
        <Button
          class="btn rounded-border btn-primary bg-primary p-4"
          label="Cancel"
          severity="primary"
          @click="visible = false"
        />
        <Button severity="success" label="Save" @click="onSave" />
      </div>
    </div>
  </Dialog>
</template>

