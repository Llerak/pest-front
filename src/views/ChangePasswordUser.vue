<template>
  <form
    class="flex flex-col gap-4 bg-white p-6 shadow-custom-shadow rounded-lg relative min-w-[460px]"
    autocomplete="off"
  >
    <h4 class="mt-4 my-2">Change Password</h4>
    <div class="flex gap-4 justify-between">
      <InputCustom
        title="Old Password"
        type="password"
        placeholder=""
        v-model="changePasswordModel.oldPassword"
        :-error-text="errorMessages.oldPassword"
        :show-error="showError.oldPassword"
      ></InputCustom>
      <InputCustom
        title="New Password"
        type="password"
        placeholder=""
        v-model="changePasswordModel.newPassword"
        :-error-text="errorMessages.newPassword"
        :show-error="showError.newPassword"
      ></InputCustom>
      <InputCustom
        title="Confirm Password"
        type="password"
        placeholder=""
        v-model="changePasswordModel.confirmPassword"
        :-error-text="errorMessages.confirmPassword"
        :show-error="showError.confirmPassword"
      ></InputCustom>
    </div>
    <div class="flex w-full justify-end gap-4 mt-4">
      <button class="text-white bg-primary" type="button" @click="validateForm">Change</button>
      <button
        class="text-primary bg-white border-primary border-solid border-2"
        type="button"
        @click="clearForm"
      >
        Clear
      </button>
    </div>
    <ButtonClose></ButtonClose>
  </form>
</template>

<script setup lang="ts">
import ButtonClose from '@/components/ButtonClose.vue'
import InputCustom from '@/components/InputCustom.vue'
import { ref, type Ref } from 'vue'
import { changePassword } from '@/services/userService'
import type IChangePassword from '@/interfaces/IChangePassword'

const inititalChangePassword: IChangePassword = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const changePasswordModel: Ref<IChangePassword> = ref({ ...inititalChangePassword })

const errorMessages = ref<Record<string, string>>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showError = ref<Record<string, boolean>>({
  oldPassword: false,
  newPassword: false,
  confirmPassword: false,
})

// Limpia los campos del formulario
const clearForm = () => {
  changePasswordModel.value = { ...inititalChangePassword }
  Object.keys(showError.value).forEach((key) => (showError.value[key] = false))
  Object.keys(errorMessages.value).forEach((key) => (errorMessages.value[key] = ''))
}

// Valida y envía los datos
const validateForm = async () => {
  // Resetea los errores
  Object.keys(showError.value).forEach((key) => (showError.value[key] = false))
  Object.keys(errorMessages.value).forEach((key) => (errorMessages.value[key] = ''))

  let isValid = true

  // Validaciones
  if (!changePasswordModel.value.oldPassword.trim()) {
    errorMessages.value.oldPassword = 'Old Password is required.'
    showError.value.oldPassword = true
    isValid = false
  }

  if (!changePasswordModel.value.newPassword.trim()) {
    errorMessages.value.newPassword = 'New Password is required.'
    showError.value.newPassword = true
    isValid = false
  }
  if (!changePasswordModel.value.confirmPassword.trim()) {
    errorMessages.value.confirmPassword = 'Confirm Password is required.'
    showError.value.confirmPassword = true
    isValid = false
  } else if (changePasswordModel.value.confirmPassword !== changePasswordModel.value.newPassword) {
    errorMessages.value.confirmPassword = 'Passwords do not match.'
    showError.value.confirmPassword = true
    isValid = false
  }

  if (isValid) {
    try {
      await changePassword(changePasswordModel.value)
      alert('Password changed successfully')
      clearForm()
    } catch (error) {
      console.error(error)
      alert('An error has occurred')
    }
  }
}
</script>
