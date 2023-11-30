<template>
  <div class="grid grid-cols-2 gap-2">
    <label
      for="cats"
      class="rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-green-300 cursor-pointer"
      :class="[selected === 'cats' ? 'ring-4 ring-green-300' : null]"
    >
      <img :src="`cats.png`" alt="" class="object-cover" />
      <input
        type="radio"
        id="cats"
        class="absolute w-0 h-0 p-0 overflow-hidden border-none whitespace-nowrap"
        v-model="selected"
        value="cats"
      />
    </label>
    <label
      for="flat"
      class="rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-green-300 cursor-pointer"
      :class="[selected === 'flat' ? 'ring-4 ring-green-300' : null]"
    >
      <img :src="`flat.png`" alt="" class="object-cover rounded-lg" />
      <input
        type="radio"
        id="flat"
        class="absolute w-0 h-0 p-0 overflow-hidden border-none whitespace-nowrap"
        v-model="selected"
        value="flat"
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
