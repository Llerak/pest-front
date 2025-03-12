<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mt-4 my-2">Generate</h4>

    <div class="flex items-end gap-4">
      <InputSelect
        title="Customer code"
        placeholder=""
        class="w-32"
        :model-value="selectedId"
        :options="idList"
        @update:modelValue="(value: any) => handleCustomerCodeUpdate(value)"
      ></InputSelect>
      <InputSelect
        title="Customer name"
        placeholder=""
        class="w-80"
        :model-value="selectedName"
        :options="nameList"
        @update:modelValue="(value: any) => handleCustomerNameUpdate(value)"
      ></InputSelect>
    </div>
    <InputCustom
      title="Period ending date"
      type="date"
      placeholder=""
      class="w-40"
      v-model="invoice.date"
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
          v-model="invoice.tech"
          :show-error="false"
        ></InputCustom>
        <InputCustom
          title="Title and Certifications"
          type="text"
          placeholder=""
          class="w-48"
          v-model="invoice.title"
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
import InputSelect from '@/components/InputSelect.vue'
import type IInvoice from '@/interfaces/IInvoice'
import { getAllInvoice, registerInvoice } from '@/services/invoiceService'
import { onMounted, ref, watch, type Ref } from 'vue'
import { customerStore, idList, nameList } from '@/store/customerStore'
import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'
import { getAllCustomers } from '@/services/customerService'

const initialInvoice: IInvoice = {
  id: 0,
  customer_id: 0,
  customer_name: '',
  date: '',
  amount: 0,
  tech: '',
  obs: '',
  title: '',
}

const invoice: Ref<IInvoice> = ref({ ...initialInvoice })

const selectedName: Ref<ICustomSelectOption<string>> = ref({
  value: '',
  text: '',
})
const selectedId: Ref<ICustomSelectOption<number>> = ref({
  value: 0,
  text: '',
})

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
  await getAllCustomers() // Asegúrate de que `customerStore` se actualice antes
  initialInvoice.date = new Date().toISOString().split('T')[0];
  invoice.value = { ...initialInvoice }
  selectedId.value = { value: 0, text: '0' }
  selectedName.value = { value: '', text: '' }
  remarks.value = [{ text: '' }]
  await getAllInvoice()
}

function handleCustomerCodeUpdate(value: ICustomSelectOption<number>) {
  selectedId.value = value
  invoice.value.customer_id = value.value

  // Busca el cliente en el store
  const customer = customerStore.value.find((c) => c.id === value.value)

  // Asigna los valores del cliente o un valor predeterminado
  if (customer) {
    selectedName.value = { value: customer.firstName, text: customer.firstName }
    invoice.value.customer_name = customer.firstName
  } else {
    selectedName.value = { value: '', text: '' } // Limpia el select
    invoice.value.customer_name = ''
  }
}

function handleCustomerNameUpdate(value: ICustomSelectOption<string>) {
  selectedName.value = value
  invoice.value.customer_name = value.value

  // Busca el cliente en el store
  const customer = customerStore.value.find((c) => c.firstName === value.value)

  // Asigna los valores del cliente o un valor predeterminado
  if (customer) {
    selectedId.value = { value: customer.id, text: customer.id.toString() }
    invoice.value.customer_id = customer.id
  } else {
    selectedId.value = { value: 0, text: '0' } // Limpia el select
    invoice.value.customer_id = 0
  }
}

async function save() {
  if (invoice.value.customer_id != 0) {
    // Busca el cliente correspondiente en customerStore
    const customer = customerStore.value.find((c) => c.id === invoice.value.customer_id);

    if (customer) {
      // Asigna el campo monthlyFee al invoice.value.amount
      invoice.value.amount = customer.monthlyFee;
    } else {
      console.warn('Customer not found in customerStore');
      alert('Failed invoice registration: Customer not found');
      return; // Detén la ejecución si no se encuentra el cliente
    }

    // Convierte las observaciones a un string formateado
    const formattedString = remarks.value.map((remark) => `(${remark.text})`).join(' ');
    invoice.value.obs = formattedString;

    // Registra la factura y limpia el formulario
    await registerInvoice(invoice.value);
    await clearForm();
    alert('Invoice Registration Completed');
  } else {
    alert('Failed invoice registration, review customer compos');
  }
}


onMounted(async () => {
  try {
    await clearForm()
  } catch (error) {
    console.log(error)
  }
})
</script>
