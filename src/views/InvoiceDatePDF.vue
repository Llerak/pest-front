<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mt-4 my-2">Invoice by Date</h4>
    <div class="flex gap-4 justify-between">
      <InputCustom
        title="Invoice from"
        type="date"
        placeholder=""
        v-model="invoiceFrom"
        :show-error="false"
      ></InputCustom>
      <InputCustom
        title="Invoice to"
        type="date"
        placeholder=""
        v-model="invoiceTo"
        :show-error="false"
      ></InputCustom>
    </div>
    <div class="flex w-full justify-end gap-4 mt-4">
      <button
        class="text-white bg-primary"
        type="button"
        @click="generateInvoicePDFByDateRange(invoiceFrom, invoiceTo)"
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
import InputCustom from '@/components/InputCustom.vue'
import type ICustomer from '@/interfaces/ICustomer'
import type IInvoice from '@/interfaces/IInvoice'
import { getAllCustomers } from '@/services/customerService'
import { getAllInvoice } from '@/services/invoiceService'
import { customerStore } from '@/store/customerStore'
import { invoiceStore } from '@/store/invoiceStore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ref, type Ref } from 'vue'

const invoiceFrom: Ref<string> = ref(new Date().toISOString().split('T')[0])
const invoiceTo: Ref<string> = ref(new Date().toISOString().split('T')[0])

const clearForm = () => {
  invoiceFrom.value = new Date().toISOString().split('T')[0]
  invoiceTo.value = new Date().toISOString().split('T')[0]
}

const generateInvoicePDFByDateRange = async (startDate: string, endDate: string): Promise<void> => {
  await getAllInvoice()
  await getAllCustomers()

  const customers: ICustomer[] = customerStore.value // Retrieve customer data
  const invoices: IInvoice[] = invoiceStore.value // Retrieve invoice data

  const doc = new jsPDF()
  const headers = ['Route', 'Customer ID', 'Customer Name', 'Invoice', 'Date', 'Amount']

  // Parse and validate dates
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.warn('Invalid date format. Please use YYYY-MM-DD.')
    alert('Invalid date format. Please use YYYY-MM-DD.')
    return
  }

  // Filter invoices by date range
  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.date)
    return invoiceDate >= start && invoiceDate <= end
  })

  if (filteredInvoices.length === 0) {
    console.warn(`No invoices found between ${startDate} and ${endDate}.`)
    alert(`No invoices found between ${startDate} and ${endDate}.`)
    return
  }

  // Combine customer and invoice data
  const data: Array<Array<string | number>> = filteredInvoices.map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id)
    return [
      customer?.route || 0,
      invoice.customer_id,
      invoice.customer_name || `${customer?.firstName} ${customer?.lastName}`,
      invoice.id,
      invoice.date,
      invoice.amount.toFixed(2),
    ]
  })

  // Calculate total amount for the filtered invoices
  const totalAmount = filteredInvoices
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
  doc.save(`Invoices_${startDate}_to_${endDate}.pdf`)
}
</script>
