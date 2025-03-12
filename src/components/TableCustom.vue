<template>
  <div class="flex flex-col gap-2">
    <div class="relative shadow-custom-shadow bg-white rounded-lg h-[400px]">
      <div class="overflow-auto h-full">
        <table class="w-full text-sm text-left">
          <thead class="text-[14px] text-[#344767] text-nowrap sticky top-0 bg-white z-10">
            <tr class="h-[50px]">
              <th v-for="(header, i) in headers" :key="i" scope="col" class="px-6 py-3">
                {{ header }}
              </th>
              <slot name="th" />
            </tr>
          </thead>
          <tbody class="overflow-y-scroll h-[360px]">
            <tr v-if="data.length < 1" class="h-[50px]">
              <td :colspan="headers.length" class="align-center">
                <div class="flex justify-center p-4">
                  <SpinnerLoading v-if="isLoading" />
                  <p v-else>{{ props.noDataMessage || 'No data available' }}</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              class="border-b cursor-pointer relative h-[50px]"
              v-for="(item, i) in data.slice(0, data.length)"
              :key="i"
              @click="watchClickInObject(item)"
            >
              <td v-for="(key, j) in keys" :key="j" class="px-6 py-4 max-h-[50px]">
                <span v-if="typeof key === 'object'">
                  {{ reduceObject(item, key) }}
                </span>
                <span v-else>{{ item[key] }}</span>
              </td>
              <slot name="td" :item="item" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import SpinnerLoading from '@/components/SpinnerLoading.vue' // Asegúrate de importar el componente SpinnerLoading
import { isLoading } from '@/store/store'

const emit = defineEmits(['returnId', 'returnItem'])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const watchClickInObject = (item: any) => {
  emit('returnId', item.id)
  emit('returnItem', item)
}

const props = defineProps<{
  headers: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  keys: string[]
  noDataMessage?: string
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reduceObject = (obj: any, path: string[]) => {
  return path.reduce((prev, key) => {
    return prev?.[key]
  }, obj)
}
</script>
