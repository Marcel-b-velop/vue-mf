<script setup lang="ts">
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue'

interface WichtelEvent {
  name: string
  gruppe: string
  password: string
}

interface Gruppe {
  grp?: string
}

const props = defineProps<Gruppe>()

onMounted(() => {
  console.log(props.grp)
})

const BaseInput = defineAsyncComponent(() => import('remote-lib/BaseInput'))

const wichtelEvent: WichtelEvent = reactive({
  name: '',
  gruppe: '',
  password: '',
})
</script>

<template>
  <h1 class="flex justify-center text-4xl mb-4">Anmeldung</h1>
  <div class="flex justify-center">
    <div>
      <BaseInput v-model="wichtelEvent.name" label="Name" type="text" class="mb-4" />
      <BaseInput v-model="wichtelEvent.password" label="Passwort" type="text" class="mb-5" />
      <hr />
      <BaseInput v-model="wichtelEvent.gruppe" label="Gruppe" type="text" class="mb-5 mt-2" />
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Anmelden
      </button>
    </div>
  </div>
</template>

<style scoped></style>
