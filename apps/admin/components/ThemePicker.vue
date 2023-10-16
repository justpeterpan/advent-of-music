<template>
  <div class="grid grid-cols-2 gap-2">
    <label
      for="dark"
      class="rounded-lg overflow-hidden focus-within:ring-4 focus-within:ring-blue-600 cursor-pointer"
      :class="[
        selected === 'dark' ? 'ring-4 ring-blue-600' : 'ring-1 ring-white',
      ]"
    >
      <img :src="`dark.jpg`" alt="" class="object-cover rounded-md" />
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
      class="rounded-lg overflow-hidden focus-within:ring-4 focus-within:ring-blue-600 cursor-pointer"
      :class="[
        selected === 'light' ? 'ring-4 ring-blue-600' : 'ring-1 ring-white',
      ]"
    >
      <img :src="`light.jpg`" alt="" class="object-cover rounded-md" />
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
