<template>
  <div class="grid grid-cols-2 gap-2">
    <label
      for="dark"
      class="border border-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600"
      :class="{ 'ring-2 ring-blue-600 border-blue-600': selected === 'dark' }"
    >
      <img :src="`dark.jpg`" alt="" class="object-cover rounded-lg" />
      <input
        type="radio"
        id="dark"
        class="absolute w-0 h-0 p-0 overflow-hidden border-none whitespace-nowrap"
        v-model="selected"
        value="dark"
      />
    </label>
    <label
      for="light"
      class="border border-white rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600"
      :class="{ 'ring-2 ring-blue-600 border-blue-600': selected === 'light' }"
    >
      <img :src="`light.jpg`" alt="" class="object-cover rounded-lg" />
      <input
        type="radio"
        id="light"
        class="absolute w-0 h-0 p-0 overflow-hidden border-none whitespace-nowrap"
        v-model="selected"
        value="light"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits()
const props = defineProps<{ modelValue: string }>()
const selected = ref(props.modelValue)

watch(selected, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>
