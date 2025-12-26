<script setup lang="ts">
interface Props {
  label: string
  modelValue: string | number
  options: { label: string, value: string | number }[]
}

withDefaults(defineProps<Props>(), { label: '', modelValue: '' })

const emit = defineEmits<{ (event: 'update:modelValue', value: string | number | null): void }>()

</script>
<template>
  <label v-if="label" class="text-xs">{{ label }}</label
  ><br />
  <select
    v-bind="{...$attrs, onChange: ($event) => emit('update:modelValue', ($event.target as HTMLInputElement).value)}"
    :placeholder="label"
    :value="modelValue"
    class="field"
  >
  <option v-for="option in options" :selected="option.value === modelValue" :key="option.value" :value="option.value">{{ option.label }}</option>
  </select><br />
</template>
