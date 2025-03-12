<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mt-4 my-2">Generate</h4>

    <div class="flex items-end gap-4">
      <InputCustom
        title="Route Nbr."
        type="number"
        placeholder=""
        class="w-32"
        :disabled="true"
        v-model="route.id"
        :show-error="false"
      ></InputCustom>
    </div>
    <InputCustom
      title="Period ending date"
      type="date"
      placeholder=""
      class="w-40"
      v-model="route.date"
      :show-error="false"
    ></InputCustom>

    <div>
      <label>Remarks</label>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="(remark, index) in remarks" :key="index" class="flex items-end gap-4 mt-2">
          <InputCustom
            title=""
            type="text"
            placeholder=""
            class="w-56"
            v-model="remark.text"
            :show-error="false"
          ></InputCustom>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-end gap-8">
      <div class="flex gap-4">
        <InputCustom
          title="Technician"
          type="text"
          placeholder=""
          class="w-48"
          v-model="route.tech"
          :show-error="false"
        ></InputCustom>
        <InputCustom
          title="Title and Certifications"
          type="text"
          placeholder=""
          class="w-48"
          v-model="route.title"
          :show-error="false"
        ></InputCustom>
      </div>
      <div class="flex gap-4 h-min">
        <button class="text-white bg-primary" type="button" @click="save()">Save</button>
        <button
          class="text-primary bg-white border-primary border-solid border-2"
          type="button"
          @click="clearForm"
        >
          Clear
        </button>
      </div>
    </div>

    <ButtonClose></ButtonClose>
  </form>
</template>

<script setup lang="ts">
import ButtonClose from '@/components/ButtonClose.vue'
import InputCustom from '@/components/InputCustom.vue'
import type IRoute from '@/interfaces/IRoute'
import { onMounted, ref, watch, type Ref } from 'vue'
import { getAllRoute, registerRoute } from '@/services/routeService'
import { routeStore } from '@/store/routeStore'

const initialRoute: IRoute = {
  id: 0,
  title: '',
  tech: '',
  obs: '',
  date: '',
}

const route: Ref<IRoute> = ref({ ...initialRoute })
const remarks: Ref<Array<{ text: string }>> = ref([{ text: '' }])

const addRemark = () => {
  if (remarks.value.length < 12) {
    remarks.value.push({ text: '' })
  }
}

// Watcher to ensure there's always one empty remark and remove empty ones
watch(
  remarks,
  (newRemarks) => {
    const hasEmptyRemark = newRemarks.some((remark) => remark.text === '')
    if (!hasEmptyRemark && newRemarks.length < 12) {
      addRemark()
    }

    if (newRemarks.length > 1) {
      let emptyCount = 0
      for (let i = newRemarks.length - 1; i >= 0; i--) {
        if (newRemarks[i].text === '') {
          emptyCount++
          if (emptyCount > 1) {
            newRemarks.splice(i, 1)
          }
        }
      }
    }
  },
  { deep: true },
)

async function clearForm() {
  initialRoute.date = new Date().toISOString().split('T')[0];
  route.value = { ...initialRoute }
  route.value.id = findMaxId(routeStore.value) + 1
  await getAllRoute()
  remarks.value = [{ text: '' }]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findMaxId(table: any) {
  if (table.length === 0) return 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Math.max(...table.map((item: { id: any }) => item.id))
}

async function save() {
  const formattedString = remarks.value.map((remark) => `(${remark.text})`).join(' ')
  route.value.obs = formattedString
  await registerRoute(route.value)
  await clearForm()
}

onMounted(async () => {
  try {
    await clearForm()
  } catch (error) {
    console.log(error)
  }
})
</script>
