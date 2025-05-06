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
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper'
  import SettingsSlotsPropertiesCard from '~/builder/app/components/settings/slots/PropertiesCard.vue'
  import SettingsSlotsDataCard from '~/builder/app/components/settings/slots/DataCard.vue'
  import SettingsSlotsLayoutCard from '~/builder/app/components/settings/slots/LayoutCard.vue'
  import SettingsSlotsValidationCard from '~/builder/app/components/settings/slots/ValidationCard.vue'
  import SettingsSlotsConditionsCard from '~/builder/app/components/settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '~/builder/app/components/settings/slots/AttributesCard.vue'
</script>
