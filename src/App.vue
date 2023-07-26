<script setup lang="ts">
import { storeToRefs } from 'pinia';
import UserAuthentication from './components/user/UserAuthentication.vue'
import { useUserStore } from './stores/userStore';
import RoomList from '@/components/room/RoomList.vue'
import { ref, watch, watchEffect } from 'vue';
import { Room } from './types';
import { useRoomStore } from './stores/rooms';
import RoomCreate from '@/components/room/RoomCreate.vue'
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
const store = useUserStore()
const { isSignedIn } = storeToRefs(store)
const roomStore = useRoomStore()
const { rooms } = storeToRefs(roomStore)
watch(isSignedIn, (newValue) => {
  if (newValue) roomStore.fetch()
  else roomStore.clear()
})
</script>

<template>
  <div class="grid grid-cols-12 text-cyan-200 bg-slate-800 py-2">
    <div class="col-span-3 flex flex-col gap-3 bg-slate-700">
      <router-link to="/">Go to Home</router-link>
      <div v-if="isSignedIn">
        <room-list :rooms="rooms" />
        <room-create @create="roomStore.create" />
      </div>
    </div>
    <div class="col-span-9 bg-slate-600">
      <router-view></router-view>
    </div>
    <!-- hidden sign in to get it fixed on global layout -->
    <user-authentication>
      <template #sign-in>
        <span>sign in</span>
      </template>
      <template #sign-out>
        <span>sign out</span>
      </template>
    </user-authentication>
  </div>
</template>
