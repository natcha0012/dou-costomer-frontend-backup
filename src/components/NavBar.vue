<template>
  <nav
    v-if="props.name === 'Edit Profile'"
    class="text-white h-[70px] p-2 pl-6 text-base flex items-center"
  >
    <button class="flex flex-row items-center" @click="goBack()">
      <IconBack class="mr-2"></IconBack>
      {{ props.name }}
    </button>
  </nav>
  <nav v-else class="relative text-white h-[70px] p-2 text-base flex items-center justify-center">
    <button v-if="hasBackNavigation" class="absolute left-2" @click="goBack()">
      <IconBack></IconBack>
    </button>
    {{ title }}
  </nav>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import IconBack from './icons/IconBack.vue'
import router from '@/router'
const props = defineProps<{
  name: string
}>()

const title = computed(() => {
  return props.name.includes('Bills') ? 'Bills' : props.name
})

const hasBackNavigation = computed(() => props.name.includes('Bills ') || props.name === 'My Cart')

const goBack = () => {
  router.go(-1)
}
</script>
