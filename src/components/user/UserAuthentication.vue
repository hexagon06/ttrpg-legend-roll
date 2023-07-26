<script setup lang="ts">
import { auth } from '@/api';
import { nextTick, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useRoute, useRouter } from 'vue-router';
import ModalOverlay from '@/components/generic/ModalOverlay.vue'

const userStore = useUserStore()
// isSigningIn is done through the store, because the fixed class does not work with a css transform parent
const { isSignedIn, isSigningIn } = storeToRefs(userStore)

const route = useRoute()
const router = useRouter()

async function signOut() {
  await auth.signOut();
  if (route.name !== 'Home') {
    router.push({ name: 'Home' });
  }
}

watch(isSigningIn, (newState) => {
  if (newState) {
    nextTick().then(() => {
      auth.signIn();
    });
  }
})
async function signIn() {
  isSigningIn.value = false;
}
function cancel() {
  isSigningIn.value = false;
}
</script>

<template>
  <div class=" bg-slate-500 text-purple">
    <div v-if="isSignedIn"
         class="flex gap-2 items-center">
      <button @click="signOut">
        <slot name="sign-out">
          <svg xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </slot>
      </button>
    </div>
    <div v-else>
      <button class="button-round-large button-on-dark-blue"
              @click="isSigningIn = true">
        <slot name="sign-in">
          <svg xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
               stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </slot>
      </button>
      <transition name="modal">
        <form v-if="isSigningIn"
              @submit.stop.prevent="signIn">
          <modal-overlay v-if="isSigningIn"
                         @close="isSigningIn = false">
            <template #body>
              <div class="text-brown-light-900">
                <div id="firebaseui-auth-container" />
              </div>
            </template>
            <template #header>
              <h3 class="text-2xl">
                Sign in with third party providers
              </h3>
            </template>
            <template #footer>
              <button class="float-right btn"
                      @click="cancel">
                Cancel
              </button>
            </template>
          </modal-overlay>
        </form>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
.firebaseui-title {
  display: none;
}

.firebaseui-form-actions {
  display: flex;
  justify-content: space-between;
}

.firebaseui-list-item {
  & img {
    width: 1.5rem;
    max-height: 1, 5rem;
    max-width: 1, 5rem;
  }

  & .firebaseui-idp-text {
    display: none;
  }

  &::before {
    content: "Sign in with ";
    color: white;
  }
}
</style>
