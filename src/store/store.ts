import type { ICustomSelectOption } from '@/interfaces/ICustomSelectOption'
import { ref, type Ref } from 'vue'

export const permissionLevel: Ref<number> = ref(0)
export const selectedComponent: Ref<string> = ref('')
export const isLoading: Ref<boolean> = ref(false)
export const statesOptions: ICustomSelectOption<string>[] = [
  { value: 'AL', text: 'AL' },
  { value: 'AK', text: 'AK' },
  { value: 'AZ', text: 'AZ' },
  { value: 'AR', text: 'AR' },
  { value: 'CA', text: 'CA' },
  { value: 'CO', text: 'CO' },
  { value: 'CT', text: 'CT' },
  { value: 'DE', text: 'DE' },
  { value: 'FL', text: 'FL' },
  { value: 'GA', text: 'GA' },
  { value: 'HI', text: 'HI' },
  { value: 'ID', text: 'ID' },
  { value: 'IL', text: 'IL' },
  { value: 'IN', text: 'IN' },
  { value: 'IA', text: 'IA' },
  { value: 'KS', text: 'KS' },
  { value: 'KY', text: 'KY' },
  { value: 'LA', text: 'LA' },
  { value: 'ME', text: 'ME' },
  { value: 'MD', text: 'MD' },
  { value: 'MA', text: 'MA' },
  { value: 'MI', text: 'MI' },
  { value: 'MN', text: 'MN' },
  { value: 'MS', text: 'MS' },
  { value: 'MO', text: 'MO' },
  { value: 'MT', text: 'MT' },
  { value: 'NE', text: 'NE' },
  { value: 'NV', text: 'NV' },
  { value: 'NH', text: 'NH' },
  { value: 'NK', text: 'NK' }, // Nota: Parece un error tipográfico en lugar de 'ND'
  { value: 'NM', text: 'NM' },
  { value: 'NY', text: 'NY' },
  { value: 'NC', text: 'NC' },
  { value: 'ND', text: 'ND' },
  { value: 'OH', text: 'OH' },
  { value: 'OK', text: 'OK' },
  { value: 'OR', text: 'OR' },
  { value: 'PA', text: 'PA' },
  { value: 'RI', text: 'RI' },
  { value: 'SC', text: 'SC' },
  { value: 'SD', text: 'SD' },
  { value: 'TN', text: 'TN' },
  { value: 'TX', text: 'TX' },
  { value: 'UT', text: 'UT' },
  { value: 'VT', text: 'VT' },
  { value: 'VA', text: 'VA' },
  { value: 'WA', text: 'WA' },
  { value: 'WV', text: 'WV' },
  { value: 'WI', text: 'WI' },
  { value: 'WY', text: 'WY' },
  { value: 'DC', text: 'DC' },
]
