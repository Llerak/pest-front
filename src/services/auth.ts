  import axios from 'axios'
  import type ILogin from '@/interfaces/Ilogin'
  import { permissionLevel } from '@/store/store'

  export async function loginService(userData: ILogin) {
    const response = await axios.post('http://localhost:3000/login', userData)
    const token = response.data.token
    permissionLevel.value = 9
    localStorage.setItem('token', token)
    return response.data
  }
