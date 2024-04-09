<template>
  <!-- <div class="w-full mt-3 border-b border-gray-500"></div> -->
  <div v-for="(item, index) in stock" :key="index">
    <div class="py-4 text-center">{{ item.productType }}</div>

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
          <tr v-for="product in item.stocks" :key="product.id" class="bg-white border-b">
            <td class="w-[60px]">img</td>
            <td class="text-left px-0">
              {{ product.productName }}
            </td>
            <td class="w-[100px] py-1">
              <input
                v-if="isEdit"
                :value="product.amount"
                @change="changeInput(product.productId, ($event.target as HTMLInputElement).value)"
                type="number"
                class="w-[40px] p-1 border rounded-md text-center"
              />
              <div v-else>{{ product.amount ?? 0 }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { useAuthStore } from '@/stores/auth-store'
import type { BranchStockResp } from '@/types/stock'
import { onMounted, ref, watch } from 'vue'

const stock = ref<BranchStockResp[]>([])
const headers = ['รายการ', '', 'จำนวนคงเหลือ']
const rawUpdatedData: Record<number, number> = {}
const { user } = useAuthStore()
const isEdit = ref(false)

onMounted(async () => {
  console.log('get branch stock')
  await getBranchStock()
})

const getBranchStock = async () => {
  if (!user?.branchId) {
    return
  }
  const { data, error } = await useFetch<BranchStockResp[]>('GET', `/stock/branch/${user.branchId}`)

  if (!data || data.errorCode || error) {
    alert('cannot get branchStock')
    return
  } else {
    stock.value = data
  }
}

const changeInput = (productId: number, value: string) => {
  rawUpdatedData[productId] = Number(value)
}

const updateLimit = async () => {
  const items = []
  for (const pId of Object.keys(rawUpdatedData)) {
    const productId = Number(pId)
    items.push({ productId, limit: rawUpdatedData[productId] })
  }

  const { data, error } = await useFetch<BranchStockResp[]>(
    'POST',
    `/stock/branch/${user?.branchId}`,
    {
      stock: []
    }
  )

  if (!data || data.errorCode || error) {
    alert('cannot update branch stock')
    return
  } else {
    stock.value = data
  }
}

watch(
  () => isEdit,
  async (newV) => {
    if (newV.value === false) {
      await updateLimit()
    }
  }
)
</script>
