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
    <RemarkModal :visible="showModal" :modalData="modalData" @close="closeModal"></RemarkModal>
    <div v-for="(pdlist, i1) in order?.orderDetail" :key="i1">
      <div class="py-4 text-center">{{ pdlist.productType }}</div>

      <div class="relative overflow-auto rounded-lg">
        <table class="w-full text-sm text-center">
          <thead class="text-xs">
            <tr class="px-4">
              <th v-for="header in headers" :key="header" scope="col" class="py-3 px-1"
                :class="{ 'pl-2': header === 'รายการ' }">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i2) in pdlist.products" :key="i2" class="bg-white border-b">
              <td>
                <div class="flex flex-row gap-2 h-full">
                  <Tooltip v-model="product.remark">
                    <img class="ml-2 w-[20px]" src="../assets/img-icons/circle-info-solid.svg" />
                  </Tooltip>
                  <div class="flex-grow text-left">
                    {{ product.productName }}
                  </div>
                </div>
              </td>
              <td>
                {{ product.orderedAmount }}
              </td>
              <td>
                <input v-model="actualProduct[product.productId]" class="rounded-md w-[60px] text-center border p-2"
                  type="number" />
              </td>
              <td>
                <div @click="
                  openModal(product.productName, product.productId, product.remark.branchRemark)
                  ">
                  <img class="w-[20px] min-w-[20px]" src="../assets/img-icons/edit.png" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="w-full flex justify-end">
      <button @click="onConfirm()" class="rounded-lg font-medium border-2 p-2 mt-3 text-white bg-[--vt-success]">
        Confirm
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { onMounted, ref, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { GetOrderByIDResp, RemarkTooltip } from '@/types/order'
import { OrderStatus, OrderThaiStatus } from '@/constant.ts/order.enum'
import RemarkModal, { type OutputRemarkEvent } from '@/components/RemarkModal.vue'
import Tooltip from '@/components/TooltipRemark.vue';

type ModalData = {
  orderId: number
  productId: number
  productName: string
  remark?: string
}

const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const modalData = ref<ModalData>({
  orderId: 0,
  productId: 0,
  productName: '',
  remark: ''
})
const orderId = route.params.orderId
const order = ref<GetOrderByIDResp>()
const totalProduct = ref(0)
const headers = ['รายการ', 'จำนวนที่สั่ง', 'จำนวนที่จัดส่ง', '']
const actualProduct = ref<Record<number, number>>({})
const remarkEachProduct = ref<Record<number, RemarkTooltip>>({})
onMounted(async () => {
  await getOrder()
  defineActualProduct()
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

const defineActualProduct = () => {
  if (!order.value?.orderDetail?.length) return
  order.value.orderDetail.forEach((type) => {
    type.products.forEach((p) => {
      actualProduct.value[p.productId] = p.actualAmount
      remarkEachProduct.value[p.productId] = p.remark
    })
  })
}

const onConfirm = async () => {
  const body: {
    productId: number
    amount: number
    masterRemark?: string
    branchRemark?: string
  }[] = []
  for (const [productId, amount] of Object.entries(actualProduct.value)) {
    body.push({
      productId: Number(productId),
      amount,
      masterRemark: remarkEachProduct.value[Number(productId)].masterRemark || undefined,
      branchRemark: remarkEachProduct.value[Number(productId)].branchRemark || undefined
    })
  }
  const { data, error } = await useFetch<string>('POST', `/order/confirm-order/${orderId}`, {
    orders: body
  })
  if (!data || data.errorCode || error) {
    alert('cannot update order status')
    return
  }
  router.push('/bills')
}

const openModal = (productName: string, productId: number, remark?: string) => {
  modalData.value = {
    orderId: Number(orderId),
    productId,
    productName,
    remark
  }
  showModal.value = true
}
const closeModal = (event: OutputRemarkEvent) => {
  if (event.isUpdate && event.data) {
    console.log(remarkEachProduct.value)
    remarkEachProduct.value[event.data.productId].branchRemark = event.data.remark
  }
  showModal.value = false
}
</script>
