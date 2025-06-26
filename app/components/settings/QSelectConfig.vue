<template>
  <SettingsExpansionBaseWrapper>
    <template #properties>
      <SettingsSlotsPropertiesCard hasDescription />
    </template>
    <template #data>
      <SettingsSlotsDataCard />
    </template>
    <template #layout>
      <SettingsSlotsLayoutCard showDense />
    </template>
    <template #validation>
      <SettingsSlotsValidationCard showLength />
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
  import SettingsSlotsDataCard from '../settings/slots/DataCard.vue'
  import SettingsSlotsLayoutCard from '../settings/slots/LayoutCard.vue'
  import SettingsSlotsValidationCard from '../settings/slots/ValidationCard.vue'
  import SettingsSlotsConditionsCard from '../settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '../settings/slots/AttributesCard.vue'
</script>
