<script setup lang="ts">
import ImageWrapper from '@/components/generic/ImageWrapper.vue';

defineProps<{ url?: string }>()
</script>

<template>
  <image-wrapper class="relative">
    <!-- <div class="h-16 w-16 rounded-full border-4 border-pink-300 flex justify-center items-center overflow-hidden relative"> -->
    <svg xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         stroke-width="1.5"
         stroke="currentColor"
         class="w-9 h-9 absolute">
      <path stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
    <img v-if="url"
         :src="url"
         class="opacity-100 hover:opacity-25 transition-opacity duration-200 absolute" />

    <!-- </div> -->
  </image-wrapper>
</template>
