<template>
  <SettingsExpansionBaseWrapper :section-labels="{ options: 'Opções de botão' }">
    <template #properties>
      <SettingsSlotsPropertiesCard hasTooltip hasDescription />
    </template>
    <template #options>
      <SettingsSlotsButtonOptionsCard />
    </template>
    <template #layout>
      <SettingsSlotsLayoutCard showFullWidth showAlignment showSize />
    </template>
    <template #conditions>
      <SettingsSlotsConditionsCard />
    </template>
  </SettingsExpansionBaseWrapper>
</template>
<script setup lang="ts">
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper.vue'
  import SettingsSlotsPropertiesCard from '../settings/slots/PropertiesCard.vue'
  import SettingsSlotsButtonOptionsCard from '../settings/slots/ButtonOptionsCard.vue'
  import SettingsSlotsLayoutCard from '../settings/slots/LayoutCard.vue'
  import SettingsSlotsConditionsCard from '../settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '../settings/slots/AttributesCard.vue'
</script>