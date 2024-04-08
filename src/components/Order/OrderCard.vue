<template>
  <div
    class="rounded-md shadow-sm bg-white px-3 py-1 flex flex-col gap-1 hover:bg-gray-50"
    @click="selectCard"
  >
    <div class="flex flex-row">
      <div class="text-gray-400">Branch: {{ branchName }}</div>
    </div>
    <div class="flex flex-row text-xs">
      <div>{{ date }}</div>
      <div class="grow text-end text-xs">
        status: <label :style="`color: ${color};`">{{ OrderThaiStatus[status] }}</label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { OrderThaiStatus, OrderStatus } from '@/constant.ts/order.enum'
import { UserRole } from '@/constant.ts/user.enum'
import { useAuthStore } from '@/stores/auth-store'
import { useRouter } from 'vue-router'
const props = defineProps<{
  branchName: string
  date: string
  status: OrderStatus
  color: string
  orderId: string
}>()

const { user } = useAuthStore()
const router = useRouter()

const selectCard = () => {
  if (props.status === OrderStatus.ORDER_PLACED || props.status === OrderStatus.PACKING) {
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.PACKING) {
      router.push(`/orders/confirm/${props.orderId}`)
    } else {
      router.push(`/orders/detail/${props.orderId}`)
    }
  }

  if (props.status === OrderStatus.PACKED) {
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.DELIVER) {
      router.push(`/orders/confirm/${props.orderId}`)
    } else {
      router.push(`/orders/detail/${props.orderId}`)
    }
  }

  if (
    props.status === OrderStatus.DELIVERING ||
    props.status === OrderStatus.SUCCESS ||
    props.status === OrderStatus.DELIVERED
  ) {
    router.push(`/orders/detail/${props.orderId}`)
  }

  return
}
</script>
