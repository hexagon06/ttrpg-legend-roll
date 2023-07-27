<script setup lang="ts">
defineProps({
  modelValue: String,
  errors: Array<String>,
  id: String,
  label: String,
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'blur']);

function onInput(input: HTMLInputElement | null) {
  if (!!input) {
    emit('update:modelValue', input.value)
  }
}
</script>

<template>
  <label :for="id">{{ label }}</label>
  <input :id="id"
         :value="modelValue"
         class="bg-slate-200 text-slate-900"
         :disabled="disabled"
         @input="onInput($event.target as HTMLInputElement)"
         @blur="$emit('blur')" />
  <template v-if="errors && errors.length > 0">
    <p v-for="error in errors"
       class="col-span-2 text-red-400 text-right">{{ error }}</p>
  </template>
</template>
