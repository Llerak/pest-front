<template>
  <div class="flex h-[100vh] w-[100vw] items-center justify-center p-4 bg-[#f8f9fa]">
    <form
      class="flex w-[360px] flex-col gap-6 bg-white p-12 shadow-custom-shadow rounded-lg"
      autocomplete="off"
    >
      <div class="flex flex-col gap-2">
        <h4 class="text-primary">Welcome</h4>
        <p>Enter your username and password to log in.</p>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <InputCustom
            title="User"
            v-model="log.name"
            type="text"
            placeholder="User"
            :show-error="false"
          />
          <InputCustom
            title="Password"
            v-model="log.password"
            type="password"
            placeholder="Password"
            :show-error="false"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span
            class="text-sm text-red-600 transition-all"
            :class="{
              'scale-100': showErrorGeneral,
              'scale-0': !showErrorGeneral,
            }"
            >Incorrect username or password</span
          >
          <button class="w-full bg-primary text-white" @click="handleLogin" type="button">
            SING IN
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import InputCustom from '@/components/InputCustom.vue'
import type ILogin from '@/interfaces/Ilogin'
import { loginService } from '@/services/auth'

const log: Ref<ILogin> = ref({ name: '', password: '' })
const showErrorGeneral: Ref<boolean> = ref(false)

const handleLogin = async () => {
  try {
    await loginService(log.value)
    showErrorGeneral.value = false
  } catch (error) {
    console.error(error)
    showErrorGeneral.value = true
  }
}
</script>
