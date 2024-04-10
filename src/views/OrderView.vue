<template>
  <!-- Header -->
  <div class="flex relative flex-col border-none -mx-6 -mt-6 px-6 bg-[--vt-primary-blue]">
    <div class="rounded-full py-2 px-5 bg-white mb-4 flex flex-row gap-2 items-center">
      <IconSerch style="width: 1em; height: 1em"></IconSerch>
      <input v-model="productFilter" class="w-full" placeholder="ค้นหาสินค้า" />
    </div>
    <div class="flex flex-row w-full overflow-auto mb-4 text-white">
      <div @click="currentTab = 0" class="min-w-fit">
        <a :class="currentTab === 0 ? activeTab : normalTab">ทั้งหมด</a>
      </div>
      <div
        v-for="ptype in productTypes"
        :key="ptype.id"
        @click="currentTab = ptype.id"
        class="min-w-fit"
      >
        <a :class="currentTab === ptype.id ? activeTab : normalTab">{{ ptype.name }}</a>
      </div>
    </div>
  </div>
  <!-- Items Amount -->
  <div
    class="relative bg-blue-200 sticky z-20 top-0 flex flex-row mt-1 -mx-5 px-6 py-3 border-2 gap-2 items-center text-xs shadow-md"
  >
    <img class="h-[1.5em]" src="../assets/footer-icon/bag.png" />
    <span>มีสินค้าในตะกร้า ทั้งหมด {{ inCartItemAmount }} รายการ</span>
    <div class="absolute right-4">
      <button class="rounded-md bg-black text-white text-xs p-2">My Cart</button>
    </div>
  </div>
  <!-- Product Items -->
  <div class="flex flex-col mt-2 gap-2">
    <div
      v-for="product in products"
      :key="product.id"
      class="relative flex flex-row p-3 bg-white shadow-md"
    >
      <div class="w-[70px] h-[50px]">img</div>
      <div class="flex flex-col gap-1">
        <div>{{ product.name }}</div>
        <div class="text-xs">ราคา / หน่วย: {{ product.price }}</div>
        <div>
          <input class="rounded-md w-[40px] h-[25px] border mr-2" type="number" />
          <label class="text-xs">หน่วย</label>
        </div>
      </div>
      <div class="absolute right-4 top-4 justify-end text-xs flex flex-col gap-2 text-gray-500">
        <p>left from stock: {{ product.stockLeft }}</p>
        <p>
          limit: <label class="text-orange-500">{{ product.limit }}</label>
        </p>
      </div>
      <div class="absolute right-4 bottom-4 text-xs text-green-500">In Cart: 0</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import IconSerch from '@/components/icons/IconSerch.vue'
import { useFetch } from '@/composables/fetch'
import type { ProductResp, ProductTypeResp } from '@/types/product'
const productFilter = ref<string>('')

const currentTab = ref(0)
const activeTab = 'inline-block pb-2 border-b-2 px-4 border-red-600 w-full'
const normalTab = 'inline-block w-full pb-2 px-4 border-b-2 border-gray-300'
const productTypes = ref<ProductTypeResp[]>([])
const products = ref<ProductResp[]>([])
const inCartItemAmount = ref(0)
onMounted(async () => {
  await getProductType()
  await getProducts()
})

const getProductType = async () => {
  const { data, error } = await useFetch<ProductTypeResp[]>('GET', '/products/types')
  if (!data || data.errorCode || error) {
    alert(data?.msg)
    return
  } else {
    productTypes.value = data
  }
  return
}

const getProducts = async () => {
  const { data, error } = await useFetch<ProductResp[]>('GET', '/products')
  if (!data || data.errorCode || error) {
    alert(data?.msg)
    return
  } else {
    products.value = data
  }
  return
}
</script>
