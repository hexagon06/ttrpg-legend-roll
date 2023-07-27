<script setup lang="ts">
import { Player } from './player';
import { usePlayerStore } from './player-store';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import PlayerForm from './PlayerForm.vue';

const router = useRouter()
const isSaving = ref(false)
const newPlayer = ref<Partial<Player>>({})

async function createPlayer(submitted: Player) {
  isSaving.value = true
  await usePlayerStore().createCurrentPlayer(submitted)
  router.push({ name: 'Home' })
  isSaving.value = false
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <p>Welcome new one!</p>
    <player-form v-model="newPlayer"
                 :disabled="isSaving"
                 @update:model-value="createPlayer" />
  </div>
</template>
