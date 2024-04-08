<template>
  <!-- <div class="w-full mt-3 border-b border-gray-500"></div> -->
  <div v-for="(item, index) in productList" :key="index">
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
              :class="{ 'pl-2': header === 'รายการ', 'pr-2 w-[70px]': header === 'Limit' }"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in item.products" :key="product.id" class="bg-white border-b">
            <td class="w-[60px]">img</td>
            <td class="text-left px-0">
              {{ product.name }}
            </td>
            <td class="w-[50px] py-1">
              <input
                v-if="isEdit"
                :value="product.limit"
                @change="changeInput(product.id, ($event.target as HTMLInputElement).value)"
                type="number"
                class="w-[40px] p-1 border rounded-md text-center"
              />
              <div v-else>{{ product.limit ?? '-' }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import type { LimitProductResp } from '@/types/limit-product'
import { onMounted, ref, watch } from 'vue'

const productList = ref<LimitProductResp[]>([])
const headers = ['รายการ', '', 'Limit']
const rawUpdatedData: Record<number, number> = {}

interface IProps {
  branchId: number
  branchMasterId?: number
  isEdit: boolean
}
const props = defineProps<IProps>()

onMounted(async () => {
  await getLimitProduct()
})

const getLimitProduct = async () => {
  if (!props.branchMasterId) {
    return
  }
  const { data, error } = await useFetch<LimitProductResp[]>('POST', '/products/list-limit', {
    branchMasterId: props.branchMasterId,
    branchId: props.branchId || null
  })

  if (!data || data.errorCode || error) {
    alert('cannot get limit product')
    return
  } else {
    productList.value = data
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

  const { data, error } = await useFetch<LimitProductResp[]>('POST', '/products/set-limit', {
    branchMasterId: props.branchMasterId,
    branchId: props.branchId || undefined,
    items
  })

  if (!data || data.errorCode || error) {
    alert('cannot update limit product')
    return
  } else {
    productList.value = data
  }
}

watch(
  () => props.branchId,
  async (newBranchId, oldBranchId) => {
    if (newBranchId !== oldBranchId) {
      await getLimitProduct()
    }
  },
  { deep: true }
)

watch(
  () => props.isEdit,
  async (newV) => {
    if (newV === false) {
      await updateLimit()
    }
  },
  { deep: true }
)
</script>
