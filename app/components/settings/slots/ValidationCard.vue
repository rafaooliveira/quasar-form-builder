<script setup lang="ts">
const { dark, localStorage } = useQuasar()
import { useFormStore } from '../../../stores/formStore'
import { getLengthLimitsFromValidation } from '../../../utils'
import SettingsSlotsConditionsCard from '../../../components/settings/slots/ConditionsCard.vue'
const formStore = useFormStore()
const { onEnteredProp } = formStore

defineProps<{ showLength?: boolean }>()

const elementsClosed = localStorage.getItem('elements-closed')

const usesLength = computed(() => formStore.activeField?.inputType !== 'number')

const elementStates = reactive<{
  required: boolean
  minLength?: string | number | null
  maxLength?: string | number | null
  exactLength?: string | number | null
}>({
  required: Boolean(formStore.activeField?.validation?.then?.includes?.('required')) || Boolean(formStore.activeField?.validation?.includes?.('required')),
  minLength: getLengthLimitsFromValidation(formStore.activeField?.validation, usesLength.value ? 'length' : 'min')?.min,
  maxLength: getLengthLimitsFromValidation(formStore.activeField?.validation, usesLength.value ? 'length' : 'max')?.max,
  exactLength: getLengthLimitsFromValidation(formStore.activeField?.validation, usesLength.value ? 'length' : 'between')?.exact
})
const propMinLengthInputRef = ref<HTMLInputElement | null>(null)
const propMaxLengthInputRef = ref<HTMLInputElement | null>(null)
const propExactLengthInputRef = ref<HTMLInputElement | null>(null)

watch(() => formStore.activeField, (newVal) => {
  elementStates.required = Boolean(newVal?.validation?.then?.includes?.('required')) || Boolean(newVal?.validation?.includes?.('required'))
  elementStates.minLength = getLengthLimitsFromValidation(newVal?.validation, usesLength.value ? 'length' : 'min')?.min
  elementStates.maxLength = getLengthLimitsFromValidation(newVal?.validation, usesLength.value ? 'length' : 'max')?.max
  elementStates.exactLength = getLengthLimitsFromValidation(newVal?.validation, usesLength.value ? 'length' : 'between')?.exact
}, { deep: true })

function onClickLabel(refElement: HTMLInputElement | null, { select = false }: { select?: boolean } = {}) {
  refElement?.focus()
  if (select) {
    refElement?.select()
  }
}
</script>
<template>
  <q-card flat>
    <q-card-section>
      <div class="row align-center items-center justify-between">
        <label for="form-required">
          <span class="text-body2">
            Obrigatório
          </span>
        </label>
        <q-toggle id="form-required" :model-value="elementStates.required" color="primary" @update:model-value="val => {
          elementStates.required = val
          if (!val && formStore.activeField?.validation?.if) {
            onEnteredProp('validation', { if: '' })
          }
          onEnteredProp('validation', val ? 'required' : '-required')
        }" />
      </div>

      <SettingsSlotsConditionsCard v-if="elementStates.required" saveTo="validation"
        noConditionsMessage="Regra de obrigatoriedade vazia"
        :conditionsDialogSubtitle="`${formStore.activeField?.name} / regra de obrigatoriedade`" />

    </q-card-section>
    <q-separator v-if="showLength" :color="dark.isActive ? 'grey-9' : 'blue-grey-1'" />
    <q-card-section v-if="showLength">
      <div>
        <div class="row align-center items-center justify-between q-mt-sm">
          <label for="form-min-length" @click="onClickLabel(propMinLengthInputRef)">
            <span class="text-body2">
              {{ usesLength ? 'Mínimo' : 'Valor mínimo' }}
            </span>
          </label>
          <q-input id="form-min-length" ref="propMinLengthInputRef" :model-value="elementStates.minLength"
            hide-bottom-space filled class="mw-200" color="cyan-8" dense type="number" @update:model-value="val => {
              elementStates.exactLength = ''
              elementStates.minLength = val
              if (!usesLength) {
                onEnteredProp('validation', '-between')
                onEnteredProp('validation', val ? `min:${val}` : '-min')
                return
              }
              onEnteredProp('validation', val ? `length:${val}${elementStates.maxLength ? ',' : ''}${elementStates.maxLength ?? ''}` : elementStates.maxLength ? `length:0,${elementStates.maxLength}` : '-length')
            }" />
        </div>
        <div class="row align-center items-center justify-between q-mt-sm">
          <label for="form-max-length" @click="onClickLabel(propMaxLengthInputRef)">
            <span class="text-body2">
              {{ usesLength ? 'Máximo' : 'Valor máximo' }}
            </span>
          </label>
          <q-input id="form-max-length" ref="propMaxLengthInputRef" :model-value="elementStates.maxLength"
            hide-bottom-space filled class="mw-200" color="cyan-8" dense type="number" @update:model-value="val => {
              elementStates.exactLength = ''
              elementStates.maxLength = val
              if (!usesLength) {
                onEnteredProp('validation', '-between')
                onEnteredProp('validation', val ? `max:${val}` : '-max')
                return
              }
              onEnteredProp('validation', val ? `length:${elementStates.minLength || 0},${val}` : elementStates.minLength ? `length:${elementStates.minLength}` : '-length')
            }" />
        </div>
        <div class="row align-center items-center justify-between q-mt-sm">
          <label for="form-exact-length" @click="onClickLabel(propExactLengthInputRef)">
            <span class="text-body2">
              {{ usesLength ? 'Exato' : 'Valor exato' }}
            </span>
          </label>
          <q-input id="form-exact-length" ref="propExactLengthInputRef" :model-value="elementStates.exactLength"
            hide-bottom-space filled class="mw-200" color="cyan-8" dense type="number" @update:model-value="val => {
              elementStates.minLength = ''
              elementStates.maxLength = ''
              elementStates.exactLength = val
              if (!usesLength) {
                onEnteredProp('validation', '-min')
                onEnteredProp('validation', '-max')
                onEnteredProp('validation', val ? `between:${val},${val}` : '-between')
                return
              }
              onEnteredProp('validation', val ? `length:${val},${val}` : '-length')
            }" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
