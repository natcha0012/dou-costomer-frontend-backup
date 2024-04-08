import { ref } from 'vue'
import type { ErrorResp } from '@/types/error'
import { useAuthStore } from '@/stores/auth-store'

export async function useFetch<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: Record<string, any>
) {
  const data = ref<T & ErrorResp>()
  const error = ref<any>(null)
  const auth = useAuthStore()

  const requestOptions: RequestInit = {
    method,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth.user?.token}`
    },
    body: body ? JSON.stringify(body) : undefined
  }
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, requestOptions)
    data.value = await res.json()
    if (data.value?.errorCode === 401) {
      auth.logout()
    }
  } catch (err) {
    error.value = err
  }
  return { data: data.value, error: error.value }
}
