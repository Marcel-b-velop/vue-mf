<script setup lang="ts">
import Confirm from "./components/Confirm.vue";
import Button from 'primevue/button';
import { ref } from "vue";

const vis = ref(false);
</script>

<template>
  <div>
    <Button @click="() => vis = true">Open Confirm</Button>
    <Confirm v-model:visible="vis"/>
  </div>
</template>

<style scoped>
</style>
