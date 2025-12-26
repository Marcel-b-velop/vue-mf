<script setup lang="ts">
interface Props {
  label: string
  modelValue: string | number
}
withDefaults(defineProps<Props>(), { label: '', modelValue: '' })
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
</template>
