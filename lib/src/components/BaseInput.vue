<template>
  <label>{{ label }}</label>
  <br />

  <input :placeholder="label" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="" />
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
  },
};
</script>

