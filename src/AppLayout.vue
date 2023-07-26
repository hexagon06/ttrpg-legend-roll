<script setup lang="ts">
import { storeToRefs } from 'pinia';
import UserAuthentication from './components/user/UserAuthentication.vue'
import { useUserStore } from './stores/userStore';
import RoomList from '@/components/room/RoomList.vue'
import { watch } from 'vue';
import { useRoomStore } from './stores/rooms';
import RoomCreate from '@/components/room/RoomCreate.vue'
import AppVersion from './AppVersion.vue'
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
  <div class="grid grid-cols-12 text-cyan-200 bg-slate-800 py-2 min-h-full">
    <div class="col-span-9 bg-slate-600">
      <slot />
    </div>
    <div class="col-span-3 flex flex-col gap-3 bg-slate-700 p-2">
      <user-authentication>
        <template #sign-in>
          <span>sign in</span>
        </template>
        <template #sign-out>
          <span>sign out</span>
        </template>
      </user-authentication>
      <hr>
      <router-link to="/">Go to Home</router-link>
      <div v-if="isSignedIn">
        <room-list :rooms="rooms" />
        <room-create @create="roomStore.create" />
      </div>
      <div class="col-span-12 flex justify-end mt-auto mb-5"><app-version /></div>
    </div>
  </div>
</template>
