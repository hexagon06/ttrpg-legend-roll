<script setup lang="ts">
import { Player } from './player';
import { usePlayerStore } from './player-store';
import { onMounted, ref } from 'vue';
import { Referenced } from '@/types/data';
import PlayerForm from './PlayerForm.vue';

const isSaving = ref(false)

const currentPlayer = ref<Referenced<Player>>()

onMounted(async () => {
  currentPlayer.value = usePlayerStore().currentPlayer
})

async function savePlayer(submitted: Referenced<Player>) {
  isSaving.value = true
  await usePlayerStore().patchCurrentPlayer(submitted)
  isSaving.value = false
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <player-form v-if="currentPlayer"
                 v-model="currentPlayer"
                 :disabled="isSaving"
                 @update:model-value="savePlayer" />
  </div>
</template>
