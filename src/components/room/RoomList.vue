<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Referenced } from '@/types/data'
import { Room } from './room'

defineProps<{ rooms: Referenced<Room>[] }>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <RouterLink v-for="room in rooms"
                :to="{ name: 'room', params: { roomId: room.id } }">{{ room.name }}</RouterLink>
  </div>
</template>
