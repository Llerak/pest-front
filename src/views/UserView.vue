<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative"
    autocomplete="off"
  >
    <div class="flex gap-4 justify-between">
      <div class="flex flex-col gap-4">
        <div class="flex gap-4">
          <div class="flex flex-col w-24">
            <InputCustom
              title="Id"
              :disabled="true"
              type="number"
              placeholder=""
              v-model="user.id"
              :show-error="false"
            ></InputCustom>
          </div>
          <div class="flex flex-col gap-2 w-[420px]">
            <InputCustom
              title="Name"
              type="text"
              placeholder=""
              v-model="user.name"
              :show-error="showErrorName"
            ></InputCustom>
            <InputCustom
              title="Password"
              type="password"
              placeholder=""
              v-model="user.password"
              :disabled="data.some((item) => item.id === user.id)"
              :show-error="showErrorPass"
            ></InputCustom>
            <InputCustom
              title="Job"
              type="text"
              placeholder=""
              v-model="user.job"
              :show-error="false"
            ></InputCustom>
          </div>
        </div>
        <TableCustom
          :data="data"
          :keys="keys"
          :headers="headers"
          @return-item="
            (value) => {
              user = JSON.parse(JSON.stringify(value))
            }
          "
        ></TableCustom>
      </div>
    </div>
    <div class="flex w-full justify-end gap-4">
      <button class="bg-primary text-white" type="button" @click="save()">Save</button>
      <button
        class="bg-white text-red-500 border-red-500 border-solid border-2"
        type="button"
        @click="deleteId()"
      >
        Delete
      </button>
      <button
        class="text-primary bg-white border-primary border-solid border-2"
        type="button"
        @click="resetUser()"
      >
        Clear
      </button>
    </div>
    <ButtonClose></ButtonClose>
  </form>
</template>

<script setup lang="ts">
import InputCustom from '@/components/InputCustom.vue'
import TableCustom from '@/components/TableCustom.vue'
import { onMounted, type Ref, ref } from 'vue'
import ButtonClose from '@/components/ButtonClose.vue'
import type IUser from '@/interfaces/IUser'
import { userStore } from '@/store/usersStore'
import { deleteUser, getAllUser, registerUser, updateUser } from '@/services/userService'

const initialUser: IUser = {
  id: 0,
  name: '',
  password: '',
  job: '',
  createDate: new Date().toISOString().split('T')[0],
  auth: true,
  state: true,
}

const user: Ref<IUser> = ref({ ...initialUser })

const showErrorName: Ref<boolean> = ref(false)
const showErrorPass: Ref<boolean> = ref(false)

const headers = ['ID', 'Name', 'Job']
const keys = ['id', 'name', 'job']

const data = ref([...userStore.value])

async function save() {
  if (!validate()) {
    return
  }

  try {
    const temUser = user.value
    temUser.createDate = temUser.createDate || new Date().toISOString().split('T')[0]
    const message: Ref<string> = ref('')
    const exists = data.value.some((item) => item.id === temUser.id)
    if (exists) {
      await updateUser(temUser.id, temUser)
      message.value = 'Successfully upgraded user'
    } else {
      await registerUser(temUser)
      message.value = 'Successfully created user'
    }

    data.value = [...userStore.value]
    alert(message.value)
  } catch (error) {
    console.log(error)
    data.value = []
    alert('An error has occurred')
  }

  await resetUser()
}

async function deleteId() {
  if (user.value.id && data.value.some((item) => item.id === user.value.id)) {
    try {
      await deleteUser(user.value.id)
      data.value = [...userStore.value]
      alert('Successfully deleted user')
    } catch (error) {
      console.log(error)
      alert('An error has occurred')
    }
  }

  await resetUser()
}

async function resetUser() {
  await getAllUser()
  initialUser.createDate = new Date().toISOString().split('T')[0]
  user.value = { ...initialUser }
  data.value = userStore.value
  user.value.id = findMaxId(data.value) + 1
  showErrorPass.value = false
  showErrorName.value = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findMaxId(table: any) {
  if (table.length === 0) return 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Math.max(...table.map((item: { id: any }) => item.id))
}

function validate() {
  showErrorName.value = user.value.name.trim() === ''
  showErrorPass.value = user.value.password.trim() === ''
  return !(showErrorName.value || showErrorPass.value)
}

onMounted(async () => {
  try {
    await resetUser()
  } catch (error) {
    console.log(error)
    data.value = []
  }
})
</script>
