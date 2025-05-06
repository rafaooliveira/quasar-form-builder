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
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper'
  import SettingsSlotsPropertiesCard from '~/builder/app/components/settings/slots/PropertiesCard.vue'
  import SettingsSlotsOptionsCard from '~/builder/app/components/settings/slots/OptionsCard.vue'
  import SettingsSlotsLayoutCard from '~/builder/app/components/settings/slots/LayoutCard.vue'
  import SettingsSlotsConditionsCard from '~/builder/app/components/settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '~/builder/app/components/settings/slots/AttributesCard.vue'
</script>
