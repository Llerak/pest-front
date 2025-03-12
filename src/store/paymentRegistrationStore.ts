import type IPaymentRegistration from '@/interfaces/IPaymentRegistration'
import { type Ref, ref } from 'vue'

export const paymentRegistrationStore: Ref<IPaymentRegistration[]> = ref([])
