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
  import SettingsExpansionBaseWrapper from './ExpansionBaseWrapper'
  import SettingsSlotsPropertiesCard from '~/builder/app/components/settings/slots/PropertiesCard.vue'
  import SettingsSlotsCheckboxOptionsCard from '~/builder/app/components/settings/slots/OptionsCard.vue'
  import SettingsSlotsLayoutCard from '~/builder/app/components/settings/slots/LayoutCard.vue'
  import SettingsSlotsValidationCard from '~/builder/app/components/settings/slots/ValidationCard.vue'
  import SettingsSlotsConditionsCard from '~/builder/app/components/settings/slots/ConditionsCard.vue'
  import SettingsSlotsAttributesCard from '~/builder/app/components/settings/slots/AttributesCard.vue'
</script>