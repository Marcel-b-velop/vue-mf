<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";

const vis = ref(false);
const onSave = (data: ConfirmData[]) => {
  console.info(data);
};
</script>

<template>
  <div class="flex flex-between flex-col items-center p-8">
    <h2>App 1</h2>
    <p>Lorem ipsum sonstwas</p>
    <Button class="bg-primary" label="Confirm" @click="vis = true" />
    <Confirm v-model:visible="vis" @saved="onSave" />
  </div>
</template>

<style scoped></style>

