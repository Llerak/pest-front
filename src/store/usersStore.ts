import type IUser from '@/interfaces/IUser'
import { type Ref, ref } from 'vue'

export const userStore: Ref<IUser[]> = ref([])
