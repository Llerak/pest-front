  import axios from 'axios'
  import type ILogin from '@/interfaces/Ilogin'
  import { permissionLevel } from '@/store/store'

  export async function loginService(userData: ILogin) {
    const response = await axios.post('https://silly-tereshkova.173-208-164-34.plesk.page/login', userData)
    const token = response.data.token
    permissionLevel.value = 9
    localStorage.setItem('token', token)
    return response.data
  }
