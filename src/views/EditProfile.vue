<template>
  <div
    class="flex flex-col bg-[--vt-c-white-soft] h-[calc(100vh-70px)] items-center px-6 py-4 gap-2"
  >
    <div class="flex justify-center mt-10 my-3">
      <img class="h-[100px] object-contain" src="../assets/Logo-2.png" />
    </div>
    <h2 class="text-xl font-bold mb-4">Edit Profile</h2>
    <div class="w-full text-gray-500">Update Phone Number</div>
    <div class="relative w-full">
      <input
        type="text"
        class="block rounded-xs px-2.5 pb-2.5 pt-5 w-full text-sm text-black bg-gray-50 border-0 border-gray-300 filter drop-shadow-md md:drop-shadow-xl appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=" "
        v-model="phoneNumber"
      />
      <label
        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >PhoneNumber</label
      >
    </div>
    <div class="w-full mt-5 text-gray-500">Update Password</div>
    <div class="relative w-full text-gray-500 mb-1">
      <input
        :type="isShowPassword ? 'text' : 'password'"
        class="block rounded-xs px-2.5 pb-2.5 pt-5 w-full text-sm text-black bg-gray-50 border-0 border-gray-300 filter drop-shadow-md md:drop-shadow-xl appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=" "
        v-model="oldPassword"
      />
      <label
        class="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >Current Password</label
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
    <div class="relative w-full text-gray-500 mb-1">
      <input
        :type="isShowPassword ? 'text' : 'password'"
        class="block rounded-xs px-2.5 pb-2.5 pt-5 w-full text-sm text-black bg-gray-50 border-0 border-gray-300 filter drop-shadow-md md:drop-shadow-xl appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=" "
        v-model="newPassword"
      />
      <label
        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >New Password</label
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
    <div class="relative w-full text-gray-500 mb-1">
      <input
        :type="isShowPassword ? 'text' : 'password'"
        class="block rounded-xs px-2.5 pb-2.5 pt-5 w-full text-sm text-black bg-gray-50 border-0 border-gray-300 filter drop-shadow-md md:drop-shadow-xl appearance-none focus:outline-none focus:ring-0 peer"
        placeholder=" "
        v-model="confirmPassword"
      />
      <label
        class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >Confirm Password</label
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
      <div v-if="newPassword && confirmPassword && confirmPassword !== newPassword">
        <div class="text-red-500 w-full text-right text-xs mt-1">
          Confirm Password Is Incorrected
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-10">
      <button
        class="rounded-xs h-[50px] w-[250px] rounded-full text-sm bg-[--vt-primary-blue] text-white"
        @click="onSave()"
      >
        <div class="flex justify-center align-middle">Save Change</div>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const route = useRouter()
const isShowPassword = ref(false)
const phoneNumber = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// eslint-disable-next-line vue/return-in-computed-property
const isValidField = () => {
  if (newPassword.value && confirmPassword.value && confirmPassword.value !== newPassword.value) {
    return false
  }
  if (!newPassword.value && !confirmPassword.value && !oldPassword.value) {
    const telNoRegex = /^0[0-9]{9}$/
    if (!phoneNumber.value) return true
    else {
      return telNoRegex.test(phoneNumber.value)
    }
  }
  if (!phoneNumber.value) {
    return true
  }
  if (newPassword.value || confirmPassword.value || oldPassword.value) {
    return false
  }
}

const onSave = async () => {
  if (!isValidField()) {
    alert('invalid input')
    return
  }
  const body = {
    telNo: phoneNumber.value || undefined,
    newPassword: newPassword.value || undefined,
    oldPassword: oldPassword.value || undefined
  }

  const { data, error } = await useFetch<string>('PATCH', '/users', body)
  if (!data || data.errorCode || error) {
    alert(data?.msg)
    return
  } else {
    alert('update success')
    route.push('/profile')
  }
}
</script>
