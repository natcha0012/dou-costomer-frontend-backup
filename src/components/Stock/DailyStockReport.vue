<template>
  <div class="flex justify-end gap-3">
    <DatePicker class="max-w-[145px]" v-model="date"></DatePicker>
    <button
      v-if="!isEdit && date == today"
      @click="isEdit = true"
      class="flex items-center gap-2 p-2 rounded-md bg-[--vt-primary-blue] text-white"
    >
      <div>edit</div>
      <img class="w-[15px]" src="../../assets/img-icons/edit-2.png" />
    </button>
    <button
      v-if="isEdit"
      class="flex items-center gap-2 p-2 rounded-md bg-green-500 text-white"
      @click="save()"
    >
      <div>save</div>
      <img class="w-[15px]" src="../../assets/img-icons/edit-2.png" />
    </button>
  </div>
  <!-- <div class="w-full mt-3 border-b border-gray-500"></div> -->
  <div v-for="(stock, index) in stockList" :key="index">
    <div class="py-4 text-center">{{ stock.productType }}</div>

    <div class="relative overflow-auto rounded-lg">
      <table class="w-full text-sm text-center">
        <thead class="text-xs">
          <tr class="px-4">
            <th
              v-for="header in isEdit ? editHeaders : headers"
              :key="header"
              scope="col"
              class="py-3 px-1"
              :class="{ 'pl-2': header === 'รายการ', 'pr-2': header === 'คงเหลือ' }"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in stock.stocks" :key="product.id" class="bg-white border-b">
            <td>img</td>
            <td class="w-[100px] text-left px-0">
              {{ product.productName }}
            </td>
            <td class="w-[50px] py-1">
              <input
                v-if="isEdit"
                type="number"
                @keyup.enter="addStock(product.productId, $event.srcElement?.value ?? '')"
                class="w-[40px] p-1 border rounded-md"
              />
            </td>
            <td>{{ product.totalIn }}</td>
            <td>{{ product.totalOut }}</td>
            <td>{{ product.stockBalance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import type { DailyStockReportType } from '@/types/stock'
import { onMounted, ref, watch } from 'vue'
import DatePicker from '../DatePicker.vue'
import { UseDate } from '@/composables/date'

const stockList = ref<DailyStockReportType[]>([])
const headers = ['รายการ', '', '', 'Today', 'Out', 'คงเหลือ']
const editHeaders = ['รายการ', '', 'In', 'Today', 'Out', 'คงเหลือ']
const isEdit = ref(false)
const date = ref('')
const today = UseDate().value

onMounted(async () => {
  date.value = today
})

const getStock = async (date: string) => {
  const { data, error } = await useFetch<DailyStockReportType[]>('POST', '/stock/list-by-date', {
    branchMasterId: 1,
    date
  })

  if (!data || data.errorCode || error) {
    alert('cannot get stock')
    return
  } else {
    stockList.value = data
  }
}

const addStock = async (productId: number, amount: string) => {
  await useFetch('POST', '/stock', {
    masterId: 1,
    productId,
    add: Number(amount)
  })
}

const save = async () => {
  isEdit.value = false
  await getStock(date.value)
}

watch(date, async (newDate) => {
  await getStock(newDate)
})
</script>
