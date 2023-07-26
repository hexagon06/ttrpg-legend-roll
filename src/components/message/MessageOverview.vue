<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRefs, watch, watchEffect } from 'vue'
import MessageDisplay from './MessageDisplay.vue'
import MessageCreate from './MessageCreate.vue'
import { useMessageApi } from '@/api';
import { Message } from '@/types';
import { Unsubscribe } from 'firebase/firestore';
import { sortBy } from 'lodash'

const props = defineProps<{ roomId: string }>()
const { roomId } = toRefs(props)

const sortedMessages = computed(() => {
    return sortBy([...messages.value], m => -m.createdWhen)
})

onMounted(subscribe)
watch(roomId, (newId) => {
    subscribe()
})
onBeforeUnmount(() => {
    unsub()
})

function subscribe() {
    if (unsub !== undefined) unsub()
    unsub = useMessageApi(roomId.value).subscribeQuery(updateHandler).unsub
}

let unsub: Unsubscribe
const messages = ref<Message[]>([])
function updateHandler(update: Message[]) {
    messages.value = update
}
</script>

<template>
    <div class="flex flex-col gap-4 px-3 my-2">
        <message-create :room-id="roomId" />
        <message-display v-for="(message, index) in sortedMessages"
                         :key="index"
                         :message="message" />
    </div>
</template>

