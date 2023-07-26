<script setup lang="ts">
import MessageOverview from '../components/message/MessageOverview.vue'

defineProps<{ roomId: string }>()
</script>

<template>
  <message-overview :room-id="roomId" />
</template>
