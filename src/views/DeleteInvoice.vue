<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mt-4 my-2">Delete Invoice</h4>
    <div class="flex gap-4 justify-between">
      <InputCustom
        title="Invoice from"
        type="number"
        placeholder=""
        v-model="invoiceFrom"
        :show-error="false"
      ></InputCustom>
      <InputCustom
        title="Invoice to"
        type="number"
        placeholder=""
        v-model="invoiceTo"
        :show-error="false"
      ></InputCustom>
    </div>
    <div class="flex w-full justify-end gap-4 mt-4">
      <button class="text-white bg-red-500" type="button" @click="deleteInvoices">Delete</button>
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
import { ref, type Ref } from 'vue'
import { deleteInvoice, getAllInvoice } from '@/services/invoiceService'

const invoiceFrom: Ref<number> = ref(0)
const invoiceTo: Ref<number> = ref(0)

// Clears the form inputs
const clearForm = () => {
  invoiceFrom.value = 0
  invoiceTo.value = 0
}

// Function to delete invoices within the range
const deleteInvoices = async () => {
  if (invoiceFrom.value > invoiceTo.value) {
    alert('The "Invoice from" value must be less than or equal to "Invoice to"!')
    return
  }

  const confirmDelete = confirm(
    `Are you sure you want to delete invoices from ${invoiceFrom.value} to ${invoiceTo.value}?`,
  )

  if (!confirmDelete) {
    return
  }

  try {
    // Loop through the range and delete each invoice
    for (let id = invoiceFrom.value; id <= invoiceTo.value; id++) {
      await deleteInvoice(id)
    }

    alert('Invoices deleted successfully!')
    await getAllInvoice() // Refresh the invoice store after deletion
    clearForm()
  } catch (error) {
    console.error('Error deleting invoices:', error)
    alert('An error occurred while deleting invoices. Please try again.')
  }
}
</script>
