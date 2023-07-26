<script setup lang="ts">
defineProps<{ url: string }>()
</script>

<template>
  <img :src="url"
       class="h-16 w-16 rounded-full border-4 border-pink-300" />
</template>
