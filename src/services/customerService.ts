import instance from '@/addons/axios'
import type ICustomer from '@/interfaces/ICustomer'
import { customerStore } from '@/store/customerStore'
import { isLoading } from '@/store/store'

export async function getAllCustomers() {
  isLoading.value = true
  try {
    const response = await instance.get('/get-customers')
    customerStore.value = response.data
  } catch (error) {
    console.error(error)

    customerStore.value = []
  }
  isLoading.value = false
}

export async function registerCustomer(customer: ICustomer) {
  isLoading.value = true
  try {
    await instance.post('/register-customer', customer)
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
  await getAllCustomers()
}

export async function updateCustomer(id: number, updatedCustomer: Partial<ICustomer>) {
  isLoading.value = true
  try {
    await instance.put(`/update-customer`, updatedCustomer, {
      params: { id },
    })

    await getAllCustomers()
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
}

export async function deleteCustomer(id: number) {
  isLoading.value = true
  try {
    await instance.delete('/delete-customer', {
      params: { id },
    })

    await getAllCustomers()
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
}
