<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const BaseInput = defineAsyncComponent(() => import('remote-lib/BaseInput'))
const haha = ref('')
</script>

<template>
  <h1>You did it!</h1>
  <div>
    <BaseInput v-model="haha" label="test test" />
  </div>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
