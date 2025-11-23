<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import { useApi } from "./composables/api";

const api = useApi();
const a = ref({title: string, done: boolean}({}));
const vis = ref(false);
const onSave = async (data: ConfirmData[]) => {
  console.info(data[0]);
  const d = await api.fetchTodo(data[0].id);
  a.value = d;
};
</script>

<template>
  <div class="flex flex-between flex-col items-center p-8">
    <h2>App 1</h2>
    <p>Lorem ipsum sonstwas</p>
{{ a.title }} - {{ a.done }}
    <Button class="bg-primary" label="Confirm" @click="vis = true" />
    <Confirm v-model:visible="vis" @saved="onSave" />
  </div>
</template>

<style scoped></style>

