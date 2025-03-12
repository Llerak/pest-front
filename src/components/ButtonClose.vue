<template>
  <button class="absolute top-2 right-4 p-0" type="button" @click="selectedComponent = ''">
    <i><CloseIcon class="w-8 h-8 text-red-500" /></i>
  </button>
</template>

<script setup lang="ts">
import CloseIcon from './icons/CloseIcon.vue';
import { selectedComponent } from '@/store/store'
</script>
