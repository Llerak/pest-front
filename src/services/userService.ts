import instance from '@/addons/axios'
import type IChangePassword from '@/interfaces/IChangePassword'
import type IUser from '@/interfaces/IUser'
import { isLoading } from '@/store/store'
import { userStore } from '@/store/usersStore'

export async function getAllUser() {
  isLoading.value = true
  try {
    const response = await instance.get('/get-users')
    userStore.value = response.data
  } catch (error) {
    console.error(error)

    userStore.value = []
  }
  isLoading.value = false
}

export async function registerUser(user: IUser) {
  isLoading.value = true
  try {
    await instance.post('/register', user)
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
  await getAllUser()
}

export async function changePassword(changePassword: IChangePassword) {
  isLoading.value = true
  try {
    await instance.post('/change-password', changePassword)
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
  await getAllUser()
}

export async function updateUser(id: number, updatedUser: Partial<IUser>) {
  isLoading.value = true
  try {
    await instance.put(`/update-user`, updatedUser, {
      params: { id },
    })

    await getAllUser()
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
}

export async function deleteUser(id: number) {
  isLoading.value = true
  try {
    await instance.delete('/delete-user', {
      params: { id },
    })

    await getAllUser()
  } catch (error) {
    console.error(error)
  }
  isLoading.value = false
}
