<template>
  <SettingsExpansionBaseWrapper :section-labels="{ options: 'Opções da caixa de seleção' }">
    <template #properties>
      <SettingsSlotsPropertiesCard />
    </template>
    <template #options>
      <SettingsSlotsCheckboxOptionsCard />
    </template>
    <template #layout>
      <SettingsSlotsLayoutCard showDense showSize showAlignment />
    </template>
    <template #validation>
      <SettingsSlotsValidationCard />
    </template>
    <template #conditions>
      <SettingsSlotsConditionsCard />
    </template>
    <template #attributes>
      <SettingsSlotsAttributesCard />
    </template>
  </SettingsExpansionBaseWrapper>
</template>
<script setup lang="ts">
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper.vue'
  import SettingsSlotsPropertiesCard from '../settings/slots/PropertiesCard.vue'
  import SettingsSlotsCheckboxOptionsCard from '../settings/slots/OptionsCard.vue'
  import SettingsSlotsLayoutCard from '../settings/slots/LayoutCard.vue'
  import SettingsSlotsValidationCard from '../settings/slots/ValidationCard.vue'
  import SettingsSlotsConditionsCard from '../settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '../settings/slots/AttributesCard.vue'
</script>