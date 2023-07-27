<script setup lang="ts">
import { onMounted, ref, toRefs, watchEffect } from 'vue';
import { useRoomApi } from './roomApi'
import { Room } from './room';

const props = defineProps<{ roomId: string }>()
const { roomId } = toRefs(props)
const room = ref<Room>()

watchEffect(async () => await loadRoom())

onMounted(async () => {
  await loadRoom()
})

async function loadRoom() {
  room.value = await useRoomApi().get(roomId.value)
}
</script>

<template>
  <div>
    <h1>Room {{ room?.name }}</h1>
    <router-view />
  </div>
</template>
