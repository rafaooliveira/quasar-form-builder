export const useFormHistoryStore = defineStore('formHistoryStore', () => {
  const pointer = ref(0)

  const memory = useMemory()

  function addToMemory(value: any) {
    const size = memory.getSize()

    if (size === 0) {
      memory.setItem(size, JSON.stringify([]))
      memory.setItem(size + 1, JSON.stringify(value))
      pointer.value = size + 1
      return
    }

    memory.setItem(size, JSON.stringify(value))
    pointer.value = size
  }

  function goBack() {
    if (pointer.value > 0) {
      pointer.value -= 1
    }

    if (memory.hasItem(pointer.value)) {
      return memory.getItem(pointer.value)
    }

    return null
  }

  function goForward() {
    const size = memory.getSize()
    if (pointer.value < size) {
      pointer.value += 1
      return memory.getItem(pointer.value)
    }

    return null
  }

  function isBackDisabled() {
    return pointer.value < 1
  }

  function isForwardDisabled() {
    const size = memory.getSize()
    return pointer.value >= size - 1
  }

  return {
    pointer,
    addToMemory,
    goBack,
    goForward,
    isBackDisabled,
    isForwardDisabled
  }
})
