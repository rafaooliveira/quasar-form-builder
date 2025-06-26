<template>
  <SettingsExpansionBaseWrapper :section-labels="{ options: 'Conteúdo' }">
    <template #properties>
      <SettingsSlotsPropertiesCard hasTooltip hasDescription />
    </template>
    <template #options>
      <SettingsSlotsOptionsCard />
    </template>
    <template #layout>
      <SettingsSlotsLayoutCard showAlignment setAttrs />
    </template>
    <template #conditions>
      <SettingsSlotsConditionsCard />
    </template>
  </SettingsExpansionBaseWrapper>
</template>
<script setup lang="ts">
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper.vue'
  import SettingsSlotsPropertiesCard from '../settings/slots/PropertiesCard.vue'
  import SettingsSlotsOptionsCard from '../settings/slots/OptionsCard.vue'
  import SettingsSlotsLayoutCard from '../settings/slots/LayoutCard.vue'
  import SettingsSlotsConditionsCard from '../settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '../settings/slots/AttributesCard.vue'
</script>
