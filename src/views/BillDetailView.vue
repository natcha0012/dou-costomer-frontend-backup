<template>
  <div class="bg-blue-300 top-0 z-10 sticky -mx-5 -my-3 px-6 py-4 shadow-md flex flex-col">
    <strong class="text-lg">Order ID: {{ orderId }}</strong>
    <div class="flex flex-row gap-2 my-2">
      <p class="text-xs">
        Order date: <strong>{{ order?.createdAt }}</strong>
      </p>
      <p class="text-xs">
        | Status: <strong>{{ OrderThaiStatus[order?.status || OrderStatus.CANCELED] }}</strong>
      </p>
    </div>
    <div v-if="showDeliveredButton" class="flex justify-center">
      <button
        @click="deliveredOrder()"
        class="flex flex-row py-2 px-4 rounded-lg w-fit bg-gray-700 text-white font-bold text-sm items-center gap-2"
      >
        <IconTruck></IconTruck>
        Delivered
      </button>
    </div>
  </div>
  <div class="min-h-[100vh] mt-5">
    <div class="text-lg font-bold text-end">Branch: {{ order?.branchName }}</div>
    <div v-for="(pdlist, i1) in order?.orderDetail" :key="i1">
      <div class="py-4 text-center">{{ pdlist.productType }}</div>

      <div class="relative overflow-auto rounded-lg">
        <table class="w-full text-sm text-left">
          <thead class="text-xs">
            <tr class="px-4">
              <th
                v-for="header in headers"
                :key="header"
                scope="col"
                class="py-3 px-1"
                :class="{ 'pl-3': header === 'รายการ' }"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i2) in pdlist.products" :key="i2" class="bg-white border-b">
              <td class="pl-3">img</td>
              <td class="flex flex-col text-left">
                <div class="w-[150px] px-0 mb-1">
                  {{ product.productName }}
                </div>
                <div class="text-xs">ราคา/หน่วย: {{ product.pricePerOne }}</div>
              </td>
              <td class="text-left w-[100px]">
                <div class="px-0 mb-1">{{ product.amount }} หน่วย</div>
                <div class="text-xs">{{ product.balance.toFixed(2) }} บาท</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="border-b border-1 mt-5 mb-2"></div>
    <div class="mb-2">Price Details</div>
    <div class="bg-white shadow-md rounded-md mb-4 px-4 py-5 text-sm">
      <div class="flex flex-row justify-between text-gray-500 mb-2">
        <label>Price ({{ totalProduct }} items)</label>
        <label>{{ order?.balance }} บาท</label>
      </div>
      <div class="flex flex-row justify-between text-gray-500 mb-5">
        <label>Delivery Fee</label>
        <label class="text-[--vt-primary-blue]">Free</label>
      </div>
      <div class="flex flex-row justify-between">
        <label>Total Amount</label>
        <label>{{ order?.balance }} บาท</label>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { OrderStatus, OrderThaiStatus } from '@/constant.ts/order.enum'
import type { GetOrderByIDResp } from '@/types/order'
import IconTruck from '@/components/icons/IconTruck.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'
import { UserRole } from '@/constant.ts/user.enum'
const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId
const order = ref<GetOrderByIDResp>()
const totalProduct = ref(0)
const headers = ['รายการ', '', 'จำนวนสินค้า']
const { user } = useAuthStore()
const showDeliveredButton = ref(false)
onMounted(async () => {
  await getOrder()
})

const getOrder = async () => {
  if (!orderId) {
    alert('cannot get order id')
  }
  const { data, error } = await useFetch<GetOrderByIDResp>('GET', `/order/${orderId}`)

  if (!data || data.errorCode || error) {
    alert('cannot get order')
    return
  }
  order.value = data

  if (data.status === OrderStatus.DELIVERING) {
    if (user?.role === UserRole.ADMIN || user?.role === UserRole.DELIVER) {
      showDeliveredButton.value = true
    }
  }
  data.orderDetail.forEach((pdlist) => {
    totalProduct.value += pdlist.products.length
  })

  return
}

const deliveredOrder = async () => {
  const { data, error } = await useFetch<GetOrderByIDResp>('POST', `/order/delivered/${orderId}`)

  if (!data || data.errorCode || error) {
    alert('cannot change status')
    return
  }
  router.push('/orders')
}
</script>
