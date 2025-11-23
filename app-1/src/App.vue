<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import { useApi } from "./composables/api";

const api = useApi();
const a = ref<{ id: number; name: string; isComplete: boolean }>({
  id: 0,
  name: "",
  isComplete: false,
});
const vis = ref(false);
const onSave = async (data: { id: number; name: string; isComplete: boolean }[]) => {
  console.info(data[0]);
  if (!data || data.length <= 0 || !data[0]) {
    return;
  }
  const d = await api.fetchTodo(data[0].id);
  a.value = d as { id: number; name: string; isComplete: boolean };
  await api.postTodo({
    name: "New Todo from App 1",
    isComplete: false,
  });
};
</script>

<template>
  <div class="flex flex-between flex-col items-center p-8">
    <h2>App 1</h2>
    <p>Lorem ipsum sonstwas</p>
    {{ a.name }} - {{ a.isComplete }}
    <Button class="bg-primary" label="Confirm" @click="vis = true" />
    <Confirm v-model:visible="vis" @saved="onSave" />
  </div>
</template>

<style scoped></style>

