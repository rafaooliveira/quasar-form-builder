<script setup lang="ts">
import { empty, eq } from "@formkit/utils"
import type { FormKitNode, FormKitSchemaDefinition } from "@formkit/core"
import WithLabelAndDescription from '../../app/components/WithLabelAndDescription.vue'
import { useFormStore } from '../../app/stores/formStore'
const formStore = useFormStore()
const { formFields, initialValues = {} } = defineProps<{
  formFields: FormKitSchemaDefinition[]
  initialValues?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Record<string, any>): void
  (e: 'on:update-values', payload: Record<string, any>): void
}>()

const values = reactive<Record<string, any>>({ ...initialValues })
const data = computed(() => ({
  ...values,
  empty,
  eq
}))

function updateValues(newValues: Record<string, any>) {
  Object.assign(values, newValues)
  emit("on:update-values", {...values})
}

function onSubmit(data: Record<string, any>, node: FormKitNode) {
  emit("submit", data)
}
</script>

<template>
  <article>
    <FormKit
      type="form"
      :model-value="values"
      @update:model-value="updateValues"
      :actions="false"
      @submit="onSubmit"
    >
      <div class="form-canvas q-py-sm rounded-borders grid grid-cols-12 row-gap-y-gutter column-gap-x-gutter">
        <div
          v-for="field in formFields"
          :key="field.name"
          class="form-field"
          :class="[
            field.columns
              ? `span-${formStore.formSettings.columns === 'default'
                  ? field.columns?.container || field.columns?.default?.container || 12
                  : field.columns?.[formStore.formSettings.columns]?.container || 12}`
              : 'span-12',
            field.align &&
              {
                right: 'flex justify-end',
                center: 'flex justify-center',
                left: 'flex justify-start'
              }[field.align] || ''
          ]"
        >
          <WithLabelAndDescription
            v-if="field.$el"
            :label="field.label"
            :info="field.info"
            :description="field.description"
          >
            <FormKitSchema :schema="field" :data="data" />
          </WithLabelAndDescription>

          <FormKitSchema v-else :schema="field" :data="data" />
        </div>
      </div>
    </FormKit>
  </article>
</template>

<style lang="scss">
.form-canvas {
  height: fit-content;
}

.form-field {
  position: relative;
  pointer-events: auto;
}

.grid {
  display: grid;
}

.grid-cols-12 {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.row-gap-y-gutter {
  row-gap: 1rem;
}

.column-gap-x-gutter {
  column-gap: 1rem;
}

@for $i from 1 through 12 {
  .span-#{$i} {
    grid-column: span $i / span $i;
  }
}
</style>
