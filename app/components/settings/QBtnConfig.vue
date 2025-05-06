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
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper'
  import SettingsSlotsPropertiesCard from '~/builder/app/components/settings/slots/PropertiesCard.vue'
  import SettingsSlotsButtonOptionsCard from '~/builder/app/components/settings/slots/ButtonOptionsCard.vue'
  import SettingsSlotsLayoutCard from '~/builder/app/components/settings/slots/LayoutCard.vue'
  import SettingsSlotsConditionsCard from '~/builder/app/components/settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '~/builder/app/components/settings/slots/AttributesCard.vue'
</script>