import { useFetch } from '@/composables/fetch'
import { UserRole } from '@/constant.ts/user.enum'
import router from '@/router'
import type { UserResponse } from '@/types/user'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: localStorage.getItem('user')
      ? (JSON.parse(localStorage.getItem('user') ?? '') as UserResponse)
      : null,
    returnUrl: ''
  }),
  actions: {
    async login(username: string, password: string) {
      const { data, error } = await useFetch<UserResponse>('POST', '/auth/login', {
        username,
        password
      })

      if (data?.errorCode || error) {
        alert(data?.msg)
        return
      }

      // update pinia state
      this.user = data as UserResponse

      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(data))

      if (this.user.role === UserRole.STAFF) {
        // TODO: redirect to staff url
        return
      }

      // redirect to previous url or default to home page
      if (this.user.role === UserRole.DELIVER) {
        router.push('/orders')
      } else {
        router.push(this.returnUrl || '/stock')
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
      router.push('/login')
    }
  }
})
