<script setup lang="ts">
import Confirm from "./components/Confirm.vue";
import Button from 'primevue/button';
import { ref } from "vue";

const vis = ref(false);
const selection = ref<string[]>([]);
</script>

<template>
  <div>
    <Button class="btn rounded-border btn-primary bg-danger p-4" @click="() => vis = true">Open da Confirm</Button>
    <Confirm v-model:visible="vis" v-model="selection"/>
  </div>
</template>

<style scoped>
</style>
