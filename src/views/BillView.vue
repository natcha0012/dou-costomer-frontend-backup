<template>
  <div class="flex flex-row w-full overflow-auto gap-3 pt-3 py-6">
    <OrderTab
      @click="tab = 'All'"
      title="All"
      color="var(--vt-primary-blue)"
      :amount="orders?.all.length || 0"
    ></OrderTab>
    <OrderTab
      @click="tab = 'Issue'"
      title="Issue"
      color="red"
      :amount="orders?.issue.length || 0"
    ></OrderTab>
    <OrderTab
      @click="tab = 'Action'"
      title="Action"
      color="orange"
      :amount="orders?.action.length || 0"
    ></OrderTab>
    <OrderTab
      @click="tab = 'Wating'"
      title="Wating"
      color="var(--vt-light-blue)"
      :amount="orders?.waiting.length || 0"
    ></OrderTab>
    <OrderTab
      @click="tab = 'Success'"
      title="Success"
      color="var(--vt-success)"
      :amount="orders?.success.length || 0"
    ></OrderTab>
  </div>
  <div class="flex flex-col gap-2 min-h-[100vh]">
    <div v-if="tab === 'All' || tab === 'Issue'" class="flex flex-col gap-1">
      <OrderCard
        v-for="order of orders?.issue"
        :key="order.orderId"
        :branch-name="order.branchName"
        :date="order.date"
        :status="order.status"
        :orderId="order.orderId"
        color="red"
      ></OrderCard>
    </div>
    <div v-if="tab === 'All' || tab === 'Action'" class="flex flex-col gap-1">
      <OrderCard
        v-for="order of orders?.action"
        :key="order.orderId"
        :branch-name="order.branchName"
        :date="order.date"
        :status="order.status"
        :orderId="order.orderId"
        color="orange"
      ></OrderCard>
    </div>
    <div v-if="tab === 'All' || tab === 'Wating'" class="flex flex-col gap-1">
      <OrderCard
        v-for="order of orders?.waiting"
        :key="order.orderId"
        :branch-name="order.branchName"
        :date="order.date"
        :status="order.status"
        :orderId="order.orderId"
        color="var(--vt-light-blue)"
      ></OrderCard>
    </div>
    <div v-if="tab === 'All' || tab === 'Success'" class="flex flex-col gap-1">
      <OrderCard
        v-for="order of orders?.success"
        :key="order.orderId"
        :branch-name="order.branchName"
        :date="order.date"
        :status="order.status"
        :orderId="order.orderId"
        color="var(--vt-success)"
      ></OrderCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import OrderTab from '../components/Order/OrderTab.vue'
import OrderCard from '@/components/Order/OrderCard.vue'
import { useFetch } from '@/composables/fetch'
import type { ListOrderResponse } from '@/types/order'

const orders = ref<ListOrderResponse>({
  all: [],
  issue: [],
  action: [],
  waiting: [],
  success: []
})
const tab = ref('All')
onMounted(async () => {
  await getOrderList()
})

const getOrderList = async () => {
  const { data, error } = await useFetch<ListOrderResponse>('GET', '/order')

  if (!data || data.errorCode || error) {
    alert('cannot get branches')
    return
  }
  orders.value = data
}
</script>
