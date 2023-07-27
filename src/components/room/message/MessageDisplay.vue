<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { Message } from './message';

const props = defineProps<{ message: Message }>()
const { message } = toRefs(props)

const returnChar = new RegExp(/[\r,\n]/gm)
const paragraphs = computed(() => message.value.text.split(returnChar))
const created = computed(() => new Date(message.value.createdWhen))
</script>

<template>
  <div class="rounded-md border flex flex-col gap-2 text-left">
    <p v-for="paragraph in paragraphs"
       class=" px-3 pt-2 ">{{ paragraph }}</p>
    <h2 class=" px-3 py-2 text-white text-xs bg-slate-500 flex justify-end gap-2 italic">
      <span>~ {{ message.author }}</span>
      <span>{{ created.toLocaleTimeString() }} @{{
        created.toLocaleDateString() }}</span>
    </h2>
  </div>
</template>
