<script setup lang="ts">
import { ref } from "vue";

const vis = ref(false);
</script>

<template>
  <div>
    <h2>App 1</h2>
    <p>Lorem ipsum sonstwas</p>
    <input type="button" value="Confirm" @click="vis = true"/>
    <Confirm v-model:visible="vis"/>
  </div>
</template>

<style scoped>
</style>
