import instance from '@/addons/axios'
import type IRoute from '@/interfaces/IRoute'
import { routeStore } from '@/store/routeStore'
import { isLoading } from '@/store/store'

export async function getAllRoute() {
  isLoading.value = true
  try {
    const response = await instance.get('/get-routes')
    routeStore.value = response.data
  } catch (error) {
    console.error(error)

    routeStore.value = []
  }
  isLoading.value = false
}

export async function registerRoute(route: IRoute) {
  isLoading.value = true
  try {
    await instance.post('/register-route', route)
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
  await getAllRoute()
}
