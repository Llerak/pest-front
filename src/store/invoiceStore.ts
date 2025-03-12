import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'
import type IInvoice from '@/interfaces/IInvoice'
import { type Ref, ref, watch } from 'vue'

export const invoiceStore: Ref<IInvoice[]> = ref([])

export const invoiceList: Ref<ICustomSelectOption<number>[]> = ref(
  invoiceStore.value.map((customer) => ({
    value: customer.id,
    text: customer.id.toString(),
  })),
)

watch(invoiceStore, (newCustomers) => {
  invoiceList.value = newCustomers.map((invoice) => ({
    value: invoice.id,
    text: invoice.id.toString(),
  }))
})
