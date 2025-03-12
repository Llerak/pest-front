<template>
  <div class="flex flex-col">
    <label class="ml-1 mb-2 text-nowrap" v-if="title">{{ title }}</label>
    <input 
      class="w-full" 
      :type="type" 
      v-model="internalValue" 
      :title="title" 
      :placeholder="placeholder" 
      :disabled="disabled" 
      :class="{'bg-gray-200':disabled}"
    />
    <span v-if="showError" class="text-sm text-red-600">
      {{ ErrorText }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  modelValue: {
    type: [String, Number], // Permitir tanto String como Number
  },
  showError: {
    type: Boolean,
    default: false,
  },
  ErrorText: {
    type: String,
    default: 'The field is required',
  },
  disabled: {
    type: Boolean,
    default: false, // Por defecto el campo no está deshabilitado
  },
});

const emit = defineEmits(['update:modelValue']);
const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue;
  }
);

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>
