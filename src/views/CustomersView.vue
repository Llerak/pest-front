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
              title="Customer Nb."
              :disabled="true"
              type="number"
              placeholder=""
              v-model="customer.id"
              :show-error="false"
            ></InputCustom>
          </div>
          <div class="flex flex-col gap-2 w-[420px]">
            <InputCustom
              title="Customer First Name"
              type="text"
              placeholder=""
              v-model="customer.firstName"
              :show-error="showErrorFirstName"
            ></InputCustom>
            <InputCustom
              title=""
              type="text"
              placeholder=""
              v-model="customer.lastName"
              :show-error="false"
            ></InputCustom>
          </div>
        </div>
        <TableCustom
          :data="data"
          :keys="keys"
          :headers="headers"
          @return-item="
            (value) => (
              (customer = JSON.parse(JSON.stringify(value))),
              (stateSelect = { value: customer.state, text: customer.state })
            )
          "
        ></TableCustom>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2 w-96">
          <InputCustom
            title="Address"
            type="text"
            placeholder=""
            v-model="customer.address1"
            :show-error="false"
          ></InputCustom>
          <InputCustom
            title=""
            type="text"
            placeholder=""
            v-model="customer.address2"
            :show-error="false"
          ></InputCustom>
        </div>
        <div class="flex gap-4">
          <InputCustom
            title="City"
            type="text"
            placeholder=""
            v-model="customer.city"
            :show-error="false"
            class="w-32"
          ></InputCustom>
          <InputSelect
            :model-value="stateSelect"
            :options="statesOptions"
            placeholder=""
            class="w-24"
            title="State"
            @emit-values="() => {}"
            @update:modelValue="
              (value: any) => ((stateSelect = value), (customer.state = stateSelect.value))
            "
          >
          </InputSelect>
          <InputCustom
            title="Zip"
            type="text"
            placeholder=""
            v-model="customer.zip"
            :show-error="false"
            class="w-24"
          ></InputCustom>
        </div>
        <div class="flex gap-4">
          <InputCustom
            title="Telephone"
            type="number"
            placeholder=""
            v-model="customer.telephone"
            :show-error="false"
            class="w-32"
          ></InputCustom>
          <InputCustom
            title="Fax"
            type="text"
            placeholder=""
            v-model="customer.fax"
            :show-error="false"
            class="w-[124px]"
          ></InputCustom>
          <InputCustom
            title="Email"
            type="text"
            placeholder=""
            v-model="customer.email"
            :show-error="showErrorEmail"
            -error-text="This is not a valid email address"
            class="w-56"
          ></InputCustom>
        </div>
        <div class="flex gap-4 items-end">
          <InputCustom
            title="Route"
            type="number"
            placeholder=""
            v-model="customer.route"
            :show-error="false"
            class="w-28"
          ></InputCustom>
          <InputCustom
            title="Monthly Fee"
            type="number"
            placeholder=""
            v-model="customer.monthlyFee"
            :show-error="false"
            class="w-28"
          ></InputCustom>
          <CustomCheckBox
            title="Tax"
            :model-value="customer.tax"
            @return-value="(value) => (customer.tax = value)"
          ></CustomCheckBox>
        </div>
        <div class="flex flex-col gap-4">
          <label>Services - Schedule</label>
          <div class="flex gap-4">
            <CustomCheckBox
              title="JAN"
              :model-value="customer.jan"
              @return-value="(value) => (customer.jan = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="FEB"
              :model-value="customer.feb"
              @return-value="(value) => (customer.feb = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="MAR"
              :model-value="customer.mar"
              @return-value="(value) => (customer.mar = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="APR"
              :model-value="customer.apr"
              @return-value="(value) => (customer.apr = value)"
            ></CustomCheckBox>
          </div>
          <div class="flex gap-4">
            <CustomCheckBox
              title="MAY"
              :model-value="customer.may"
              @return-value="(value) => (customer.may = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="JUN"
              :model-value="customer.jun"
              @return-value="(value) => (customer.jun = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="JUL"
              :model-value="customer.jul"
              @return-value="(value) => (customer.jul = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="AUG"
              :model-value="customer.aug"
              @return-value="(value) => (customer.aug = value)"
            ></CustomCheckBox>
          </div>
          <div class="flex gap-4">
            <CustomCheckBox
              title="SEP"
              :model-value="customer.sep"
              @return-value="(value) => (customer.sep = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="OCT"
              :model-value="customer.oct"
              @return-value="(value) => (customer.oct = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="NOV"
              :model-value="customer.nov"
              @return-value="(value) => (customer.nov = value)"
            ></CustomCheckBox>
            <CustomCheckBox
              title="DEC"
              :model-value="customer.dec"
              @return-value="(value) => (customer.dec = value)"
            ></CustomCheckBox>
          </div>
        </div>
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
        @click="resetCustomer()"
      >
        Clear
      </button>
    </div>
    <ButtonClose></ButtonClose>
  </form>
</template>

<script setup lang="ts">
import CustomCheckBox from '@/components/CustomCheckBox.vue'
import InputCustom from '@/components/InputCustom.vue'
import TableCustom from '@/components/TableCustom.vue'
import { onMounted, type Ref, ref } from 'vue'
import InputSelect from '@/components/InputSelect.vue'
import type ICustomer from '@/interfaces/ICustomer'
import ButtonClose from '@/components/ButtonClose.vue'
import {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/services/customerService'
import { customerStore } from '@/store/customerStore'
import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'
import { statesOptions } from '@/store/store'

const initialCustomer: ICustomer = {
  id: 1,
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  tax: false,
  zip: '',
  createDate: '',
  telephone: 0,
  fax: '',
  email: '',
  route: 0,
  monthlyFee: 0,
  jan: false,
  feb: false,
  mar: false,
  apr: false,
  may: false,
  jun: false,
  jul: false,
  aug: false,
  sep: false,
  oct: false,
  nov: false,
  dec: false,
}

const customer: Ref<ICustomer> = ref({ ...initialCustomer })

const showErrorEmail: Ref<boolean> = ref(false)
const showErrorFirstName: Ref<boolean> = ref(false)

const headers = ['ID', 'Name', 'Email']
const keys = ['id', 'firstName', 'email']
const stateSelect: Ref<ICustomSelectOption<string>> = ref({
  value: '',
  text: '',
})

const data = ref([...customerStore.value])

async function save() {
  if (!validate()) {
    return
  }

  try {
    const temCustomer = customer.value
    temCustomer.createDate = temCustomer.createDate || new Date().toISOString().split('T')[0]
    const message: Ref<string> = ref('')
    const exists = data.value.some((item) => item.id === temCustomer.id)
    if (exists) {
      await updateCustomer(temCustomer.id, temCustomer)
      message.value = 'Successfully upgraded user'
    } else {
      await registerCustomer(temCustomer)
      message.value = 'Successfully created user'
    }

    data.value = [...customerStore.value]
    alert(message.value)
  } catch (error) {
    console.log(error)
    data.value = []
    alert('An error has occurred')
  }

  await resetCustomer()
}

async function deleteId() {
  if (customer.value.id && data.value.some((item) => item.id === customer.value.id)) {
    try {
      await deleteCustomer(customer.value.id)
      data.value = [...customerStore.value]
      alert('Successfully deleted user')
    } catch (error) {
      console.log(error)
      alert('An error has occurred')
    }
  }

  await resetCustomer()
}

async function resetCustomer() {
  await getAllCustomers()
  initialCustomer.createDate = new Date().toISOString().split('T')[0]
  customer.value = { ...initialCustomer }
  data.value = customerStore.value
  customer.value.id = findMaxId(data.value) + 1
  stateSelect.value = { value: '', text: '' }
  showErrorEmail.value = false
  showErrorFirstName.value = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findMaxId(table: any) {
  if (table.length === 0) return 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Math.max(...table.map((item: { id: any }) => item.id))
}

function validate() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  showErrorFirstName.value = customer.value.firstName.trim() === ''
  showErrorEmail.value = !emailRegex.test(customer.value.email.trim())

  return !(showErrorFirstName.value || showErrorEmail.value)
}

onMounted(async () => {
  try {
    await resetCustomer()
  } catch (error) {
    console.log(error)
    data.value = []
  }
})
</script>
