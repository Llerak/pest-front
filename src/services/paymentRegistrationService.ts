import instance from '@/addons/axios'
import type IPaymentRegistration from '@/interfaces/IPaymentRegistration'
import { paymentRegistrationStore } from '@/store/paymentRegistrationStore'
import { isLoading } from '@/store/store'

export async function getAllPaymentRegistration() {
  isLoading.value = true
  try {
    const response = await instance.get('/get-payments')
    paymentRegistrationStore.value = response.data
  } catch (error) {
    console.error(error)

    paymentRegistrationStore.value = []
  }
  isLoading.value = false
}

export async function registerPayment(paymentRegistration: IPaymentRegistration) {
  isLoading.value = true
  try {
    await instance.post('/register-payment', paymentRegistration)
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
  await getAllPaymentRegistration()
}
