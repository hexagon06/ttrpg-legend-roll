<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PlayerAvatar from './PlayerAvatar.vue';
import { usePlayerStore } from './player-store';
import { useUserStore } from '@/components/user/userStore';
import UserAuthentication from '@/components/user/UserAuthentication.vue'

const userStore = useUserStore()
const { isSignedIn } = storeToRefs(userStore)

const { currentPlayer } = storeToRefs(usePlayerStore())

</script>

<template>
  <user-authentication class=""
                       :class="{ 'my-auto': !isSignedIn }">
    <template #sign-in>
      <span>sign in</span>
    </template>
    <template #sign-out>
      <span>sign out</span>
    </template>
  </user-authentication>
  <RouterLink v-if="currentPlayer"
              :to="{ name: 'player-edit', params: { playerId: currentPlayer.id } }">
    <player-avatar :url="currentPlayer.avatarUrl">

    </player-avatar>
  </RouterLink>
</template>
