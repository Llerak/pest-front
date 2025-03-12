<!-- SubMenu.vue -->
<template>
  <div ref="menu" class="relative flex justify-center items-center">
    <p @click="toggle" class="p-2 cursor-pointer">{{ props.title }}</p>
    <div
      v-if="isOpen"
      class="top-[140%] left-0 absolute bg-white shadow-md flex flex-col gap-2 m-1"
    >
      <div v-for="item in props.items" :key="item.name" class="relative flex flex-col">
        <a class="text-nowrap p-2 cursor-pointer" @click="() => handleItemClick(item)">
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { selectedComponent } from '@/store/store'

// Actualización del tipo de items para hacer que componentName y onClick sean opcionales
const props = defineProps<{
  items: Array<{
    name: string
    componentName?: string // Ahora es opcional
    onClick?: () => void // Sigue siendo opcional
  }>
  title: string
}>()

const isOpen = ref(false)
const menu = ref<HTMLElement | null>(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

// Manejar clics fuera del menú
const handleClickOutside = (event: MouseEvent) => {
  if (menu.value && !menu.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

// Lógica para manejar el clic en un ítem
const handleItemClick = (item: { componentName?: string; onClick?: () => void }) => {
  if (item.onClick) {
    item.onClick() // Ejecuta la función opcional si existe
  }
  if (item.componentName) {
    selectedComponent.value = item.componentName // Solo cambia el componente si está definido
  }
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
