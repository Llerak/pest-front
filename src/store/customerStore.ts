import { type Ref, ref, watch } from 'vue'
import type ICustomer from '@/interfaces/ICustomer'
import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'

export const customerStore: Ref<ICustomer[]> = ref([])

export const idList: Ref<ICustomSelectOption<number>[]> = ref(
  customerStore.value
    .filter((customer) => customer.monthlyFee > 0) // Filtrar clientes con monthlyFee > 0
    .map((customer) => ({
      value: customer.id,
      text: customer.id.toString(),
    })),
)

export const nameList: Ref<ICustomSelectOption<string>[]> = ref(
  customerStore.value
    .filter((customer) => customer.monthlyFee > 0) // Filtrar clientes con monthlyFee > 0
    .map((customer) => ({
      value: customer.firstName,
      text: customer.firstName,
    })),
)

watch(customerStore, (newCustomers) => {
  idList.value = newCustomers
    .filter((customer) => customer.monthlyFee > 0) // Filtrar clientes con monthlyFee > 0
    .map((customer) => ({
      value: customer.id,
      text: customer.id.toString(),
    }))

  nameList.value = newCustomers
    .filter((customer) => customer.monthlyFee > 0) // Filtrar clientes con monthlyFee > 0
    .map((customer) => ({
      value: customer.firstName,
      text: customer.firstName,
    }))
})
