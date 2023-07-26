<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMessageStore } from '../../stores/messages';
import { useUserStore } from '../user/userStore';

const props = defineProps<{ roomId: string }>()

const title = ref('')
const text = ref('')
const isValid = computed(() => text.value.length > 0)
const { addMessageTo } = useMessageStore()
const userStore = useUserStore()

async function create() {
  if (text.value.length > 0) {
    const currentUser = userStore.currentUser
    if (currentUser === undefined) throw new Error('user must be signed in')
    const author = currentUser.displayName === null ? 'no name user' : currentUser.displayName
    await addMessageTo({
      text: text.value,
      author,
      authorId: currentUser.uid,
      createdWhen: Date.now()
    }, props.roomId)
    title.value = text.value = '';
  }
}
</script>

<template>
  <div class="flex gap-3 items-end">
    <textarea v-model="text"
              class="flex-grow" />
    <div>
      <button @click="create"
              class="p-3 border border-slate-400"
              :disabled="!isValid">Post</button>
    </div>
  </div>
</template>
@/components/user/userStore