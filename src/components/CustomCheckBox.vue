<template>
  <div class="flex items-center justify-between">
    <label v-if="title !== ''">{{ title }}</label>
    <div @click="toggleValue" :class="{ active: internalValue }" class="checkbox-container">
      <div></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, defineEmits, watch } from 'vue'

// Ahora modelValue puede ser boolean o number
const props = defineProps<{ modelValue: boolean | number; title?: string }>()
const emit = defineEmits(['returnValue'])

// Convertir el modelValue a boolean y manejar números también
const value = ref<boolean>(!!props.modelValue) // Convierte 0/1 a false/true
const internalValue = ref(!!props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = !!newValue // Normaliza valores numéricos a boolean
    value.value = !!newValue
  },
)

const toggleValue = () => {
  value.value = !value.value
  internalValue.value = value.value
  emit('returnValue', value.value ? 1 : 0) // Emite el valor como número (1 o 0)
}
</script>

<style scoped>
.checkbox-container {
  @apply grid items-center;
  margin: 0.2rem;
  height: 20px;
  width: 40px;
  border-radius: 10px;
  outline: 1px solid #e9e9e9;
  box-shadow: inset 1px 2px 5px 0 rgb(0, 0, 0, 0.2);
  transition-duration: 0.3s;
  position: relative;
}

.checkbox-container > div {
  position: absolute;
  height: 80%;
  width: 40%;
  border-radius: 100%;
  margin: 1px 2px;
  background-color: gray;
  border: 1px solid gray;
  transition-duration: 0.3s;
}

.checkbox-container.active {
  @apply bg-primary;
  box-shadow: inset 1px 2px 5px 2px rgb(0, 0, 0, 0.15);
}

.checkbox-container.active > div {
  background-color: whitesmoke;
  border-color: whitesmoke;
  transform: translateX(20px);
}
</style>
