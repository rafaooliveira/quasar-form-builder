<script setup lang="ts">
import WithLabelAndDescription from '../WithLabelAndDescription.vue'
import type { FormKitFrameworkContext } from '@formkit/core'
import type { QBtnProps } from 'quasar'

// Define props that combine FormKit context and QBtnProps
defineProps<{ context: FormKitFrameworkContext & { attrs: QBtnProps } }>()
</script>

<template>
  <WithLabelAndDescription :label="context.label" :info="context.attrs.info" :description="context.attrs.description">
    <q-btn unelevated :class="{ 'full-width': context.attrs.full }" :label="context.attrs.buttonLabel"
      :icon="context.attrs.icon" :color="context.attrs.color || 'primary'" :loading="context.attrs.loading || false"
      :type="context.type || 'button'" :disable="context.attrs.disable || false" :size="context.attrs.size || 'md'"
      no-caps v-bind="context.attrs" @click="(event) => context?.node.input(event)" />
  </WithLabelAndDescription>
</template>
