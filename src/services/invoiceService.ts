import instance from '@/addons/axios'
import type IInvoice from '@/interfaces/IInvoice'
import { invoiceStore } from '@/store/invoiceStore'

import { isLoading } from '@/store/store'

export async function getAllInvoice() {
  isLoading.value = true
  try {
    const response = await instance.get('/get-invoices')
    invoiceStore.value = response.data
  } catch (error) {
    console.error(error)

    invoiceStore.value = []
  }
  isLoading.value = false
}

export async function registerInvoice(invoice: IInvoice) {
  isLoading.value = true
  try {
    await instance.post('/register-invoice', invoice)
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
  await getAllInvoice()
}

export async function deleteInvoice(id: number) {
  isLoading.value = true
  try {
    await instance.delete('/delete-invoice', {
      params: { id },
    })

    await getAllInvoice()
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
}
