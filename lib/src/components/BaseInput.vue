<script setup lang="ts">

interface Props {
  label: string
  modelValue: string | number
  errorMessage: string
}

const props = withDefaults(defineProps<Props>(), { label: '', modelValue: '', errorMessage: '' })
const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | null): void }>()

</script>
<template>
  <label class="text-xs">{{ label }}</label
  ><br />
  <input
    v-bind="$attrs"
    :placeholder="label"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="field"
  /><br />
  <small v-if="errorMessage" class="text-red-500" >{{ errorMessage }}</small>
</template>
