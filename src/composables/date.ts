import { ref } from 'vue'

const date = ref('')

export const UseDate = (timestamp?: number) => {
  // return '2024/02/28';
  const timest = timestamp ?? Date.now() + 7 * 60 * 60 * 1000
  const yyyy = new Date(timest).getUTCFullYear()
  const mm = new Date(timest).getUTCMonth() + 1
  const dd = new Date(timest).getUTCDate()
  date.value = `${yyyy}-${mm.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}`
  return date
}
