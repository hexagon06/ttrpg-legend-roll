<script setup lang="ts">
import { Player } from './player';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import ValidationInput from '@/components/form/ValidationInput.vue';
import { toRefs } from 'vue';
import { useVModel } from '@vueuse/core'
import ImageWrapper from '@/components/generic/ImageWrapper.vue';

const props = defineProps<{ modelValue: Partial<Player>, disabled?: boolean }>()
const emit = defineEmits(['update:modelValue'])
const player = useVModel(props, 'modelValue', emit)
const { disabled } = toRefs(props)

// https://vee-validate.logaretm.com/v4/guide/composition-api/getting-started/
const { meta, values, errors, defineInputBinds, handleSubmit, defineComponentBinds } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      displayName: yup.string().min(3).required().default(player.value.displayName),
      avatarUrl: yup.string().url().max(500).default(player.value.avatarUrl),
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

const onSubmit = handleSubmit(async (submitted) => {
  player.value = {
    ...player.value,
    ...submitted
  }
})
</script>

<template>
  <div class="w-96 flex flex-col text-left gap-2 bg-slate-800 p-4">
    <ValidationInput v-bind="displayName"
                     :disabled="disabled" />
    <ValidationInput v-bind="avatarUrl"
                     :disabled="disabled" />
    <template v-if="values.avatarUrl && !errors.avatarUrl">
      <ImageWrapper>
        <img :src="values.avatarUrl" />
      </ImageWrapper>
    </template>
    <div class="flex justify-end">
      <button @click="onSubmit"
              class="bg-slate-700 disabled:bg-slate-800"
              :disabled="disabled || !meta.valid">Submit</button>
    </div>
  </div>
</template>
