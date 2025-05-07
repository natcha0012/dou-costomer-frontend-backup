<template>
  <div class="relative inline-block" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot></slot>
    <div v-if="isTooltipVisible && modelValue"
      class="absolute bottom-6 left-0 flex items-start flex-col bg-black/50 text-white text-sm px-2 py-1 rounded shadow-lg">
      <p class="whitespace-pre">มาสเตอร์: {{ modelValue.masterRemark }}</p>
      <p class="whitespace-pre">สาขา: {{ modelValue.branchRemark }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RemarkTooltip } from '@/types/order'
import { ref } from 'vue'

defineProps<{ modelValue: RemarkTooltip }>()

const isTooltipVisible = ref(false)

const showTooltip = () => {
  isTooltipVisible.value = true
}

const hideTooltip = () => {
  isTooltipVisible.value = false
}
</script>
