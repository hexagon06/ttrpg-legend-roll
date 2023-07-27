<script setup lang="ts">
import { storeToRefs } from 'pinia';
import UserAuthentication from './components/user/UserAuthentication.vue'
import { useUserStore } from './components/user/userStore';
import RoomList from '@/components/room/RoomList.vue'
import { computed, watch } from 'vue';
import { useRoomStore } from '@/components/room/roomStore';
import RoomCreate from '@/components/room/RoomCreate.vue'
import AppVersion from './AppVersion.vue'
import { usePlayerStore } from './components/player/player-store';
import PlayerAvatar from './components/player/PlayerAvatar.vue';

const userStore = useUserStore()
const { isSignedIn } = storeToRefs(userStore)
const { currentPlayer } = storeToRefs(usePlayerStore())
const hasPlayer = computed(() => !!currentPlayer.value)
const roomStore = useRoomStore()
const { rooms } = storeToRefs(roomStore)
watch(isSignedIn, (newValue) => {
  if (newValue) roomStore.fetch()
  else roomStore.clear()
})
</script>
<template>
  <div class="grid grid-cols-12 text-cyan-200 bg-slate-800 py-2 min-h-full">
    <div v-if="isSignedIn"
         class="col-span-9 bg-slate-600">
      <slot />
    </div>
    <div class="col-span-3 flex flex-col gap-3 bg-slate-700 p-2"
         :class="[isSignedIn ? 'col-span-3' : 'col-span-12']">
      <div class="flex justify-end gap-4 items-center">
        <user-authentication class=""
                             :class="{ 'my-auto': !isSignedIn }">
          <template #sign-in>
            <span>sign in</span>
          </template>
          <template #sign-out>
            <span>sign out</span>
          </template>
        </user-authentication>
        <player-avatar v-if="currentPlayer?.avatarUrl"
                       :url="currentPlayer.avatarUrl" />
      </div>
      <div v-if="hasPlayer">
        <hr>
        <router-link to="/">Go to Home</router-link>
        <room-list :rooms="rooms" />
        <room-create @create="roomStore.create" />
      </div>
      <div class="col-span-12 flex justify-end mt-auto mb-5"><app-version /></div>
    </div>
  </div>
</template>