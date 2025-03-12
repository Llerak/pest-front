<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mt-4 my-2">Invoice by Customer</h4>
    <div class="flex gap-4 justify-between">
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
    </div>
    <div class="flex w-full justify-end gap-4 mt-4">
      <button
        class="text-white bg-primary"
        type="button"
        @click="generateInvoicePDFForCustomer(selectedId.value)"
      >
        Generate
      </button>
      <button
        class="text-primary bg-white border-primary border-solid border-2"
        type="button"
        @click="clearForm"
      >
        Clear
      </button>
    </div>
    <ButtonClose></ButtonClose>
  </form>
</template>

<script setup lang="ts">
import ButtonClose from '@/components/ButtonClose.vue'
import InputSelect from '@/components/InputSelect.vue'
import type ICustomer from '@/interfaces/ICustomer'
import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'
import type IInvoice from '@/interfaces/IInvoice'
import { getAllCustomers } from '@/services/customerService'
import { getAllInvoice } from '@/services/invoiceService'
import { idList } from '@/store/customerStore'
import { nameList } from '@/store/customerStore'
import { customerStore } from '@/store/customerStore'
import { invoiceStore } from '@/store/invoiceStore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { onMounted, ref, type Ref } from 'vue'

const selectedName: Ref<ICustomSelectOption<string>> = ref({
  value: '',
  text: '',
})
const selectedId: Ref<ICustomSelectOption<number>> = ref({
  value: 0,
  text: '',
})

function handleCustomerCodeUpdate(value: ICustomSelectOption<number>) {
  selectedId.value = value

  // Busca el cliente en el store
  const customer = customerStore.value.find((c) => c.id === value.value)

  // Asigna los valores del cliente o un valor predeterminado
  if (customer) {
    selectedName.value = { value: customer.firstName, text: customer.firstName }
  } else {
    selectedName.value = { value: '', text: '' } // Limpia el select
  }
}

function handleCustomerNameUpdate(value: ICustomSelectOption<string>) {
  selectedName.value = value

  // Busca el cliente en el store
  const customer = customerStore.value.find((c) => c.firstName === value.value)

  // Asigna los valores del cliente o un valor predeterminado
  if (customer) {
    selectedId.value = { value: customer.id, text: customer.id.toString() }
  } else {
    selectedId.value = { value: 0, text: '0' } // Limpia el select
  }
}

const clearForm = () => {
  selectedId.value = { value: 0, text: '0' }
  selectedName.value = { value: '', text: '' }
}

const generateInvoicePDFForCustomer = async (customerId: number): Promise<void> => {
  await getAllInvoice()
  await getAllCustomers()

  const customers: ICustomer[] = customerStore.value // Retrieve customer data
  const invoices: IInvoice[] = invoiceStore.value // Retrieve invoice data

  // Find the customer in the customerStore
  const customer = customers.find((c) => c.id === customerId)

  if (!customer) {
    console.warn(`No customer found with ID: ${customerId}`)
    alert(`No customer found with ID: ${customerId}`)
    return
  }

  // Filter invoices for the given customer ID
  const customerInvoices = invoices.filter((invoice) => invoice.customer_id === customerId)

  if (customerInvoices.length === 0) {
    console.warn(`No invoices found for customer ID: ${customerId}`)
    return
  }

  const doc = new jsPDF()
  const headers = ['Route', 'Customer ID', 'Customer Name', 'Invoice', 'Date', 'Amount']

  // Prepare data for the table
  const data: Array<Array<string | number>> = customerInvoices.map((invoice) => [
    customer.route,
    invoice.customer_id,
    invoice.customer_name || `${customer.firstName} ${customer.lastName}`,
    invoice.id,
    invoice.date,
    invoice.amount.toFixed(2), // Format the number
  ])

  // Calculate the total amount for the customer's invoices
  const totalAmount = customerInvoices
    .reduce((total, invoice) => total + invoice.amount, 0)
    .toFixed(2)

  // Add a row for the total
  data.push(['', '', '', '', 'Total:', totalAmount])

  // Generate the table
  autoTable(doc, {
    head: [headers],
    body: data,
  })

  // Save the PDF file
  doc.save(`InvoicesForCustomer${customerId}.pdf`)
}

onMounted(async () => {
  await getAllInvoice()
  await getAllCustomers()
})
</script>
