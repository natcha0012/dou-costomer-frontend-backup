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
  </div>
  <div class="min-h-[100vh] mt-5">
    <div class="text-lg font-bold text-end">Branch: {{ order?.branchName }}</div>
    <div v-for="(pdlist, i1) in order?.orderDetail" :key="i1">
      <div class="py-4 text-center">{{ pdlist.productType }}</div>

      <div class="relative overflow-auto rounded-lg">
        <table class="w-full text-sm text-center">
          <thead class="text-xs">
            <tr class="px-4">
              <th
                v-for="header in headers"
                :key="header"
                scope="col"
                class="py-3 px-1"
                :class="{ 'pl-2': header === 'รายการ' }"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i2) in pdlist.products" :key="i2" class="bg-white border-b">
              <td>img</td>
              <td class="w-[150px] text-left px-0">
                {{ product.productName }}
              </td>
              <td>{{ product.amount }}</td>
              <td>
                <button
                  v-if="product.confirm"
                  @click="unConfirm(i1, i2)"
                  class="rounded-lg font-medium border-2 p-2 text-white bg-[--vt-success]"
                >
                  confirm
                </button>
                <button
                  v-else
                  @click="confirm(i1, i2)"
                  class="rounded-lg font-medium border-2 p-2 text-[--vt-success] border-[--vt-success]"
                >
                  confirm
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- <div v-if="confirmCount === totalProduct" class="mt-5 flex w-full justify-center">
      <button class="rounded-lg px-3 py-2 w-full mx-5 text-sm border-2 border-black">
        finished
      </button>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { GetOrderByIDResp } from '@/types/order'
import { OrderStatus, OrderThaiStatus } from '@/constant.ts/order.enum'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId
const order = ref<GetOrderByIDResp>()
const confirmCount = ref(0)
const totalProduct = ref(0)
const headers = ['รายการ', '', 'จำนวนสินค้า', '']
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
  data.orderDetail.forEach((pdlist) => {
    totalProduct.value += pdlist.products.length
  })
  return
}

const confirm = (i1: number, i2: number) => {
  confirmCount.value++
  ;(order.value as GetOrderByIDResp).orderDetail[i1].products[i2].confirm = true
}

const unConfirm = (i1: number, i2: number) => {
  confirmCount.value--
  ;(order.value as GetOrderByIDResp).orderDetail[i1].products[i2].confirm = false
}

const goNextStage = async () => {
  console.log('goNextStage')
  if (order.value?.status === OrderStatus.PACKING) {
    const { data, error } = await useFetch<string>('POST', `/order/packed/${orderId}`)
    if (!data || data.errorCode || error) {
      alert('cannot update order status')
      return
    }
    router.push('/orders')
  }
  if (order.value?.status === OrderStatus.PACKED) {
    const { data, error } = await useFetch<string>('POST', `/order/delivering/${orderId}`)
    if (!data || data.errorCode || error) {
      alert('cannot update order status')
      return
    }
    router.push('/orders')
  }
}

const startChecking = async () => {
  console.log('start checking')
  if (!order.value) return
  if (order.value.status === OrderStatus.ORDER_PLACED) {
    const { data, error } = await useFetch<string>('POST', `/order/packing/${orderId}`)
    if (!data || data.errorCode || error) {
      alert('cannot update order status')
      return
    }
    order.value.status = OrderStatus.PACKING
  }
}

watch(
  confirmCount,
  async () => {
    await startChecking()
  },
  { once: true }
)

watch(confirmCount, async (newV) => {
  if (newV === totalProduct.value) {
    await goNextStage()
  }
})
</script>
