import type { FormKitSchemaDefinition, FormKitSchemaNode } from '@formkit/core'
import type { ActiveFieldType, ColumnsType, FormSettingsType, FormViewportType } from '~/types'
import { useFormHistoryStore } from './formHistoryStore'
import { generateUniqueName, isEmptyObject, nameExists } from '../utils/index'
export const useFormStore = defineStore('formStore', () => {
  const { notify, localStorage } = useQuasar()
  
  
  const cachedFormFields: string | null = localStorage.getItem('form-fields')

  const formSettings = ref<FormSettingsType>({
    formName: 'Meu Formulário',
    preview: { width: 432, isFullWidth: false },
    previewMode: 'editing',
    columns: 'default'
  })

  const formFields = ref<FormKitSchemaDefinition[]>(cachedFormFields ? JSON.parse(cachedFormFields) : [])
  const activeField = ref<ActiveFieldType>(null)
  const values = reactive({})

  const getSchema = computed(() => {
    // @ts-expect-error the following lines is envolved in differents types, but certainly they should not fail
    return formFields.value.reduce((acc, { name, ...rest }) => {
      // @ts-expect-error this is fine since we know our node schema always have object style definition
      acc[name] = rest
      return acc
    }, {})
  })

  const getFields = computed(() => {
    return formFields.value.map(formField => {
      if (formSettings.value.previewMode === 'editing' && formField && Object.keys(formField).some(objKey => objKey.includes('if'))) {
        // @ts-expect-error clone is an object
        const { if: [], ...rest } = formField
        return { ...rest, hasCondition: true }
      }

      return formField
    })
  })

  const getActiveFieldColumns = computed(() => {
    if (!activeField.value?.columns?.default && !activeField.value?.columns?.sm && !activeField.value?.columns?.lg) {
      return activeField.value?.columns?.container || 12
    }

    return activeField.value?.columns?.[formSettings.value.columns]?.container || 12
  })

  const cacheFormFields = () => {
    const formHistoryStore = useFormHistoryStore()
    formHistoryStore.addToMemory(formFields.value)
    localStorage.setItem('form-fields', JSON.stringify(formFields.value))
  }

  const setFormFields = (newFields: FormKitSchemaDefinition[]) => {
    formFields.value = newFields
    localStorage.setItem('form-fields', JSON.stringify(newFields))
  }

  const getFieldByName = (fieldName: string) => {
    return formFields.value.find(formField => formField.name === fieldName)
  }

  const addField = (field: FormKitSchemaNode, pos?: number | null) => {
    pos = Number(pos)
    const formLength = formFields.value.length
    field.name = generateUniqueName(field?.name, formFields.value)
    if (pos <= 0) {
      formFields.value.unshift(field)
    } else if (pos >= formLength) {
      formFields.value.push(field)
    } else {
      formFields.value.splice(pos, 0, field)
    }
    notify({ color: 'dark', message: `${field?.name} adicionado` })
    cacheFormFields()
  }

  const updateFieldIndex = ({ draggedField, originalPosition, destinationIndex }: {
    draggedField: FormKitSchemaDefinition,
    originalPosition: number,
    destinationIndex: number
  }) => {
    formFields.value.splice(originalPosition, 1)
    formFields.value.splice(destinationIndex, 0, draggedField!)

    cacheFormFields()
  }

  const removeField = (field: FormKitSchemaNode | null, index?: number) => {
    if (!field) return

    if (!index) {
      index = formFields.value.findIndex(ff => ff.name === field?.name)
    }

    if (index < 0) return

    removeAllConditionsUses(field)

    formFields.value.splice(index, 1)

    if (field?.name === activeField.value?.name) {
      setActiveField(null)
    }

    cacheFormFields()
  }

  const copyField = (index: number | null, fieldElement?: FormKitSchemaNode) => {
    const field = fieldElement || formFields.value.find((_, i) => i === index)
    if (!field) return
    if (!index) {
      index = formFields.value.findIndex(formField => formField.name === field.name)
    }
    const newElemPosition = index + 1
    const newField = { ...field, name: field?.name.split('_').at(0) }
    addField(newField, newElemPosition)
    setActiveField(newField)
  }

  const setActiveField = (newField: ActiveFieldType) => {
    activeField.value = newField
  }

  const updateNameField = (oldName?: string, newName?: string) => {
    if (!oldName) return

    const indexToUpdate = formFields.value.findIndex(field => field.name === oldName)
    if (indexToUpdate === -1) return

    if (!newName) return new Error('name cannot be empty', { cause: 500 })

    if (/\s/.test(newName)) return new Error('name cannot contain spaces', { cause: 500 })

    if (nameExists(newName, formFields.value)) return new Error('name already exists', { cause: 500 })

    formFields.value[indexToUpdate].name = newName

    cacheFormFields()
  }

  const insertValidationRule = (
    validation: boolean | string | { if: string, then: string, else: string },
    newRule: string | boolean
  ): string => {
    const rules = typeof validation === 'string' ? validation.split("|") : typeof validation !== 'string' && typeof validation !== 'boolean' ? validation.then.split("|") : []
    const ruleName = typeof newRule === 'string' ? newRule.split(":")[0] : newRule

    const updatedRules = rules.map((rule) =>
      rule.startsWith(ruleName + ":") ? newRule : rule
    )

    if (!updatedRules.includes(newRule)) {
      updatedRules.push(newRule)
    }

    return updatedRules.filter(updateRule => updateRule).join("|")
  }

  const removeValidationRule = (
    validation: string | { if: string, then: string, else: string },
    ruleToRemove: string
  ): string => {
    const rules = validation && typeof validation === 'string' ? validation.split("|") : validation && typeof validation !== 'string' ? validation.then.split("|") : []

    const updatedRules = rules.filter((rule) => !rule.includes(ruleToRemove))
    return updatedRules.join("|")
  }

  const updatePropFromActiveField = async (fieldElement: FormKitSchemaNode | null, propName?: string, newPropValue?: any) => {
    if (!propName || !fieldElement) return

    const indexToUpdate = formFields.value.findIndex(field => field.name === fieldElement.name)
    if (indexToUpdate === -1 || !activeField.value) return

    const updatedPropValue = (propName === 'validation' && newPropValue) || (propName === 'disable' && Object.keys(newPropValue).length)
      ? handleValidationUpdate(fieldElement, propName, newPropValue)
      : propName === 'attrs' && newPropValue
        ? {
          ...fieldElement[propName],
          ...Object.fromEntries([newPropValue.split(':').map((part) => part.trim())]),
        }
        : newPropValue

    updateFieldProperties(propName, updatedPropValue, indexToUpdate)

    await nextTick()

    if (shouldDeleteProperty(updatedPropValue)) {
      deleteFieldProperty(propName, indexToUpdate)
    }
    cacheFormFields()
  }

  const handleValidationUpdate = (fieldElement: FormKitSchemaNode, propName: string, newPropValue: any) => {

    if (!fieldElement[propName]?.if && newPropValue.if) {
      // If the current validation doesn't have 'if' and the new property has 'if'
      return {
        ...newPropValue,
        then: fieldElement[propName],
        else: convertToBoolean(toggleToFalse(removeRequiredRule(newPropValue?.else || fieldElement[propName]))),
      }
    }
    // Otherwise, update the validation element
    return updateValidationElement(fieldElement, propName, newPropValue)
  }

  // Function to update the validation element of a form element
  const updateValidationElement = (fieldElement: FormKitSchemaNode, propName: string, newPropValue: any) => {
    if (newPropValue?.if === '') {
      // If the new property has an empty 'if', return the 'then' part of the validation
      return fieldElement[propName]?.then
    }

    if (newPropValue?.if) {
      // If the new property has 'if', merge it with the current validation
      return { ...fieldElement[propName], ...newPropValue }
    }

    // Get the appropriate validation element based on the new property and current validation
    const validationElement = getValidationElement(
      fieldElement,
      propName,
      newPropValue
    )


    if (newPropValue?.if) {
      // If the new property has 'if', return a new validation object with 'then' and 'else'
      return {
        ...newPropValue,
        then: validationElement,
        else: convertToBoolean(toggleToFalse(removeRequiredRule(validationElement))),
      }
    }

    if (fieldElement[propName]?.if) {
      // If the current validation has 'if', return a new validation object with 'then' and 'else'
      return {
        ...fieldElement[propName],
        then: validationElement,
        else: convertToBoolean(toggleToFalse(removeRequiredRule(validationElement))),
      }
    }

    // Otherwise, return the validation element as is
    return validationElement
  }

  const getValidationElement = (fieldElement: FormKitSchemaNode, propName: string, newPropValue: any): string => {
    return newPropValue && newPropValue?.startsWith?.('-')
      ? removeValidationRule(fieldElement[propName], newPropValue.substring(1))
      : insertValidationRule(fieldElement[propName] || '', newPropValue)
  }

  const removeRequiredRule = (validation: string) => String(validation)?.match?.('required')?.length ? validation?.replace?.(/(^required\||\|required$|^required$|\|required\|)/, "") : String(validation)

  const toggleToFalse = (validation: any) => {
    if (typeof validation === 'string') return validation?.replace?.("true", "false")

    return validation
  }

  const convertToBoolean = (validation: string) => {
    if (validation?.match?.('true')?.length) return true
    if (validation?.match?.('false')?.length) return false

    return validation
  }

  const updateFieldProperties = (propName: string, newPropValue: any, indexToUpdate: number) => {
    activeField.value = { ...activeField.value, [propName]: newPropValue }
    formFields.value = formFields.value.map((field, index) =>
      index === indexToUpdate ? { ...field, [propName]: newPropValue } : field
    )
  }

  const deleteFieldProperty = (propName: string, indexToUpdate: number) => {
    const { [propName]: _, ...restActiveField } = activeField.value
    const { [propName]: __, ...restFormField } = formFields.value[indexToUpdate]
    activeField.value = restActiveField
    formFields.value = formFields.value.map((field, index) =>
      index === indexToUpdate ? restFormField : field
    )
  }

  const deleteFieldPropertyByName = (prop: string, fieldName: string) => {
    const field = formFields.value.find(f => f.name === fieldName)

    if (!field) return

    if (activeField.value) {
      const { [prop]: activeProp, ...restActive } = activeField.value
      activeField.value = activeProp?.else
        ? { [prop]: activeProp.else, ...restActive }
        : restActive
    }

    const { [prop]: fieldProp, ...restField } = field

    formFields.value = formFields.value.map(f =>
      f.name === fieldName
        ? fieldProp?.else
          ? { [prop]: fieldProp.else, ...restField }
          : restField
        : f
    )
  }

  const removeAllConditionsUses = (field: FormKitSchemaNode) => {
    const ifConditionNames = formFields.value.filter(formField => formField.if && formField.if.includes(field.name)).map(fieldForm => fieldForm.name)
    const validationConditionNames = formFields.value.filter(formField => formField.validation && formField.validation.if && formField.validation.if.includes(field.name)).map(fieldForm => fieldForm.name)

    ifConditionNames.forEach(name => deleteFieldPropertyByName('if', name))
    validationConditionNames.forEach(name => deleteFieldPropertyByName('validation', name))
  }

  const shouldDeleteProperty = (newPropValue: any) => newPropValue === false || newPropValue === '' || isEmptyObject(newPropValue)

  const changePreviewWidth = (newWidth: string | number | null) => {
    formSettings.value.preview.width = newWidth

    // TODO: cache form preview width
    // INFO: suggestion: https://unstorage.unjs.io/guide/utils#snapshots
  }

  const togglePreviewFullWidth = (isFull: boolean) => {
    formSettings.value.preview.isFullWidth = isFull

    // TODO: cache form preview is full width
    // INFO: suggestion: https://unstorage.unjs.io/guide/utils#snapshots
  }

  const changeViewport = (viewportToChange: FormViewportType) => {
    formSettings.value.columns = viewportToChange
  }

  const updateActiveFieldColumns = (newColumns: number) => {
    if (activeField.value) {
      if (!activeField.value?.columns) {
        activeField.value.columns = { container: newColumns }
        return
      }

      if (!activeField.value.columns?.default && !activeField.value?.columns.sm && !activeField.value.columns?.lg && formSettings.value.columns === 'default') {
        activeField.value.columns.container = newColumns
        return
      }

      activeField.value.columns[formSettings.value.columns] = { container: newColumns }

      // If has container value save it inside default scope
      if (formSettings.value.columns !== 'default' && activeField.value.columns.container) {
        activeField.value.columns.default = { container: activeField.value.columns.container }
        delete activeField.value.columns.container
      }
    }
  }

  const updateActiveFieldOnFormFields = () => {
    const indexToUpdate = formFields.value.findIndex(field => field.name === activeField.value.name)
    formFields.value[indexToUpdate] = { ...activeField.value }
    cacheFormFields()
  }

  const onEnteredProp = (propName: string, propValue?: string | number | boolean | null | ColumnsType | { if: string }
  ) => {
    if (!propName) return

    updatePropFromActiveField(activeField.value, propName, propValue)
  }
  return {
    values,
    formSettings,
    formFields,
    activeField,
    getSchema,
    getFields,
    getActiveFieldColumns,
    setFormFields,
    getFieldByName,
    addField,
    updateFieldIndex,
    removeField,
    copyField,
    setActiveField,
    updateNameField,
    updatePropFromActiveField,
    changePreviewWidth,
    togglePreviewFullWidth,
    changeViewport,
    updateActiveFieldColumns,
    updateActiveFieldOnFormFields,
    onEnteredProp
  }
})
