<template>
  <div class="flex min-h-screen flex-col gap-2">
    <div
      v-for="order of orders"
      :key="order.productType"
      class="flex flex-col justify-center gap-2"
    >
      <div class="mt-2 text-center text-lg">{{ order.productType }}</div>
      <div
        v-for="product of order.products"
        :key="product.id"
        class="relative flex flex-row p-3 py-4 bg-white shadow-md"
      >
        <div class="w-[70px]">img</div>
        <div class="flex flex-col gap-2">
          <div class="flex flex-row">
            <div>
              {{ product.name }}
            </div>
            <div
              class="flex items-center ml-2 rounded-full bg-[--vt-success] px-2 py-0.5 mb-1 text-white text-center text-[10px] font-bold"
            >
              {{ product.amount }} หน่วย
            </div>
          </div>
          <div class="text-xs">ราคา / หน่วย: {{ product.pricePerAmount }}</div>
        </div>
        <div class="absolute right-3 flex flex-col gap-3 justify-end items-end">
          <div @click="deleteItem(order.productType, product.id)">
            <IconTrash style="width: 16px; height: 16px; color: red"></IconTrash>
          </div>
          <div
            class="rounded-md bg-[--vt-primary-blue] py-[4px] text-xs text-center text-white w-[80px]"
          >
            {{ product.balance }}
          </div>
        </div>
      </div>
    </div>
    <div class="border-b border-1 mt-5 mb-2"></div>
    <div class="mb-2">Price Details</div>
    <div class="bg-white shadow-md rounded-md mb-4 px-4 py-5 text-sm">
      <div class="flex flex-row justify-between text-gray-500 mb-2">
        <label>Price ({{ totalProduct }} items)</label>
        <label>{{ totalBalance.toFixed(2) }} บาท</label>
      </div>
      <div class="flex flex-row justify-between text-gray-500 mb-5">
        <label>Delivery Fee</label>
        <label class="text-[--vt-primary-blue]">Free</label>
      </div>
      <div class="flex flex-row justify-between">
        <label>Total Amount</label>
        <label>{{ totalBalance.toFixed(2) }} บาท</label>
      </div>
    </div>

    <div class="flex justify-center mt-5">
      <button
        class="rounded-xs h-[50px] w-[250px] rounded-full text-sm bg-[--vt-success] text-white"
        @click="placeOrder()"
      >
        <div class="flex justify-center align-middle">Place Order</div>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { AddInCartOrderReq, PreviewOrderItems } from '@/types/order'
import IconTrash from '@/components/icons/IconTrash.vue'
import { onMounted, ref } from 'vue'
import { useFetch } from '@/composables/fetch'
import { useRouter } from 'vue-router'

const rawOrders = localStorage.getItem('orders')
const orders = ref<PreviewOrderItems[]>(JSON.parse(rawOrders ?? '[]'))
const totalProduct = ref(0)
const totalBalance = ref(0)
const router = useRouter()

onMounted(() => {
  orders.value.forEach((or) => {
    or.products.forEach((p) => {
      p.balance = multiple(p.amount, Number(p.pricePerAmount))
      totalProduct.value = totalProduct.value + p.amount
      totalBalance.value = totalBalance.value + Number(p.balance)
    })
  })
})
const multiple = (a: number, b: number) => {
  return (a * b).toFixed(2)
}

const deleteItem = (productType: string, productId: number) => {
  const orderIdx = orders.value.findIndex((or) => or.productType == productType)
  const targetItemIdx = orders.value[orderIdx].products.findIndex((p) => p.id === productId)
  totalProduct.value = totalProduct.value - orders.value[orderIdx].products[targetItemIdx].amount
  totalBalance.value =
    totalBalance.value - Number(orders.value[orderIdx].products[targetItemIdx].balance) || 0
  orders.value[orderIdx].products = orders.value[orderIdx].products.splice(0, targetItemIdx)
}

const placeOrder = async () => {
  const orderBody: AddInCartOrderReq = { orders: [] }
  orders.value.forEach((or) => {
    or.products.forEach((p) => {
      orderBody.orders.push({ productId: p.id, amount: p.amount })
    })
  })
  const { data, error } = await useFetch<{ id: string }>('POST', '/order/add-to-cart', orderBody)
  if (!data || data.errorCode || error) {
    alert('place order failed')
    return
  }
  const { data: data2, error: error2 } = await useFetch<string>(
    'POST',
    `/order/place-order/${data.id}`
  )
  if (!data2 || data2.errorCode || error2) {
    alert('place order failed')
    return
  }
  router.push('/bills')
  return
}
</script>
