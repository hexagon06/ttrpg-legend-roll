<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Referenced } from 'pony-platypus-firestore-api'
import { Room } from '../../types/room'

defineProps<{ rooms: Referenced<Room>[] }>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <RouterLink v-for="room in rooms"
                :to="{ name: 'room', params: { roomId: room.id } }">{{ room.name }}</RouterLink>
  </div>
</template>
