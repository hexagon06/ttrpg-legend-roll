<script setup lang="ts">
import { Player } from './player';
import { usePlayerStore } from './player-store';
import PlayerAvatar from './PlayerAvatar.vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import ValidationInput from '@/components/form/ValidationInput.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// https://vee-validate.logaretm.com/v4/guide/composition-api/getting-started/
const router = useRouter()
const { meta, values, errors, defineInputBinds, handleSubmit, defineComponentBinds } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      displayName: yup.string().min(3).required(),
      avatarUrl: yup.string().url().max(500),
    })
  ),
});

const displayName = defineComponentBinds('displayName', {
  mapProps: state => ({
    errors: state.errors,
    id: state.path,
    label: 'Display Name'
  })
});
const avatarUrl = defineComponentBinds('avatarUrl', {
  mapProps: state => ({
    errors: state.errors,
    id: state.path,
    label: 'Avatar Url'
  })
});

const isSaving = ref(false)

const onSubmit = handleSubmit(async (submitted) => {
  isSaving.value = true
  await usePlayerStore().createCurrentPlayer(submitted)
  router.push({ name: 'Home' })
  isSaving.value = false
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <p>Welcome new one!</p>
    <div class="w-96 flex flex-col text-left gap-2 bg-slate-800 p-4">
      <ValidationInput v-bind="displayName"
                       :disabled="isSaving" />
      <ValidationInput v-bind="avatarUrl"
                       :disabled="isSaving" />
      <template v-if="values.avatarUrl && !errors.avatarUrl">
        <PlayerAvatar :url="values.avatarUrl" />
      </template>
      <div class="flex justify-end">
        <button @click="onSubmit"
                class="bg-slate-700 disabled:bg-slate-800"
                :disabled="isSaving || !meta.valid">Submit</button>
      </div>
    </div>
  </div>
</template>
