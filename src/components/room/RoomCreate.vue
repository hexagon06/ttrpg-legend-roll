<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['create'])
const name = ref('')
</script>

<template>
  <div class="flex gap-2">
    <input v-model="name" />
    <button :disabled="name.length < 3"
            @click="emit('create', name)">+</button>
  </div>
</template>
