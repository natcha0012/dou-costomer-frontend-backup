<template>
  <div class="relative flex flex-row">
    <div class="rounded-full border h-[25px] pl-4 pr-[35px]" :style="`border-color: ${color};`">
      {{ title }}
    </div>
    <div
      class="absolute right-0 w-[25px] h-[25px] text-xs flex items-center justify-center rounded-full text-white"
      :style="`background-color: ${color};`"
    >
      {{ amount }}
    </div>
  </div>
</template>
<script setup lang="ts">
interface IProps {
  title: string
  color: string
  amount: number
}
defineProps<IProps>()
</script>
