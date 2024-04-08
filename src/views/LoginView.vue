<template>
  <div class="flex flex-col w-full gap-3">
    <div class="flex justify-center">
      <img class="h-[100px] object-contain" src="../assets/Logo.png" />
    </div>
    <div class="text-xl font-bold flex justify-start">Login</div>
    <div class="relative">
      <input
        type="text"
        class="block rounded-xs px-2.5 pb-2.5 pt-5 w-full text-sm text-black bg-gray-50 border-0 border-gray-300 filter drop-shadow-md md:drop-shadow-xl appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=" "
        v-model="username"
      />
      <label
        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >Username</label
      >
    </div>
    <div class="relative">
      <input
        :type="isShowPassword ? 'text' : 'password'"
        class="block rounded-xs px-2.5 pb-2.5 pt-5 w-full text-sm text-black bg-gray-50 border-0 border-gray-300 filter drop-shadow-md md:drop-shadow-xl appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=" "
        v-model="password"
      />
      <label
        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >Password</label
      >
      <div
        v-if="isShowPassword"
        class="absolute right-2 top-4"
        @click="isShowPassword = !isShowPassword"
      >
        <i class="fa-regular fa-eye"></i>
      </div>
      <div v-else class="absolute right-2 top-4" @click="isShowPassword = !isShowPassword">
        <i class="fa-regular fa-eye-slash"></i>
      </div>
    </div>
    <div class="flex justify-center mt-5">
      <button
        class="rounded-xs h-[50px] w-[250px] rounded-full text-sm bg-[--vt-primary-blue] text-white"
        @click="login()"
      >
        <div class="flex justify-center align-middle">Login</div>
      </button>
    </div>
    <div class="mt-5 grid justify-items-center">
      <div class="text-xs">หากลืมรหัสผ่าน โปรดติดต่อฝ่ายบริการช่วยเหลือของโต้ว</div>
      <div class="mt-5 bg-white p-4 rounded-full">
        <button
          class="bg-[#FF0000] hover:bg-red-600 rounded-full p-2 ring-1 ring-[#FF0000] ring-offset-4"
        >
          <IconSupport class="text-white"></IconSupport>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import IconSupport from '@/components/icons/IconSupport.vue'
import { useAuthStore } from '@/stores/auth-store'
const isShowPassword = ref(false)
const username = ref()
const password = ref()

const login = async () => {
  const authStore = useAuthStore()

  await authStore.login(username.value, password.value).catch((error) => {
    console.error(error)
  })
}
</script>
