<template>
  <div class="flex flex-col w-full">
    <div class="flex font-bold">Stock At Our Branches</div>
    <div class="flex flex-row gap-2 mb-5">
      <div
        v-for="branch in branches"
        :key="branch.id"
        class="mt-3 gap-2 flex flex-col items-center"
      >
        <div
          class="flex justify-center overflow-hidden rounded-full h-20 w-20 border-white border-[6px] shadow-md"
        >
          <img class="object-cover" :src="branch.branchUrl" :alt="`branch${branch.id}`" />
        </div>
        <div class="text-sm">{{ branch.name }}</div>
      </div>
    </div>
    <div class="flex font-bold my-3 w-full">Best Sellers</div>
    <div
      class="relative w-full px-2 py-3 rounded-lg border text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
    >
      <select class="w-full" v-model="formData.branchId">
        <option selected :value="0">สาขาทั้งหมด</option>
        <option v-for="item in branches" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="flex flex-row my-2 gap-2 w-full">
      <DatePicker
        style="width: calc(50% - 4px); font-size: 14px"
        title="From:"
        :max="formData.endDate || undefined"
        v-model="formData.startDate"
      ></DatePicker>

      <DatePicker
        style="width: calc(50% - 4px); font-size: 14px"
        title="To:"
        :min="formData.startDate || undefined"
        v-model="formData.endDate"
      ></DatePicker>
    </div>
    <div class="w-full my-5 flex-col">
      <div class="w-full flex justify-center items-center">
        <DoughnutChart
          v-if="bestSeller.length"
          class="w-1/2 mb-10"
          :chartData="chartData"
          :options="options"
        />
        <div v-else>No Product Sold!!</div>
      </div>
      <div class="mx-5">
        <div v-for="(item, index) of bestSeller" :key="index" class="mb-3 flex flex-row">
          <div
            class="w-5 h-5 mr-5 rounded-md"
            :style="`background-color: ${backgroundColor[index]}`"
          ></div>
          <div>{{ item.productName }} ({{ item.percent }}%)</div>
          <div class="grow text-end">{{ item.sold }}</div>
        </div>
        <div class="m-5">
          <button
            v-if="showAllProduct === false"
            class="w-full h-10 rounded-full border-2 hover:bg-[--vt-primary-blue] hover:text-white hover:shadow-md text-[--vt-primary-blue] border-[--vt-primary-blue] text-center"
            @click="showAllProduct = true"
          >
            show all
          </button>
        </div>
        <div v-if="showAllProduct">
          <div v-for="(item, index) of soldProducts" :key="index" class="mb-3 flex flex-row">
            <div>{{ item.productName }} ({{ item.percent }}%)</div>
            <div class="grow text-end">{{ item.sold }}</div>
          </div>
          <div class="m-5">
            <button
              class="w-full h-10 rounded-full border-2 hover:bg-[--vt-primary-blue] hover:text-white hover:shadow-md text-[--vt-primary-blue] border-[--vt-primary-blue] text-center"
              @click="showAllProduct = false"
            >
              show less
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { UserRole } from '@/constant.ts/user.enum'
import { useAuthStore } from '@/stores/auth-store'
import type { BranchResp, SoldProductResp } from '@/types/branch'
import DatePicker from '../components/DatePicker.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const branches = ref<(BranchResp & { branchUrl: string })[]>([])
const { user } = useAuthStore()
const showAllProduct = ref(false)

const formData = ref({
  branchId: 0,
  startDate: '',
  endDate: ''
})
const options = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  }
})

const bestSeller = ref<SoldProductResp[]>([])
const soldProducts = ref<SoldProductResp[]>([])
const backgroundColor = ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED']

const chartData = computed(() => ({
  labels: bestSeller.value.map((item) => item.productName),
  datasets: [
    {
      data: bestSeller.value.map((item) => Number(item.sold)),
      backgroundColor
    }
  ]
}))

onMounted(async () => {
  await getBranches()
  await getSoldProduct()
})

const getBranches = async () => {
  if (!user) {
    return
  }
  if (!user.branchMasterId && user.role !== UserRole.SUPER_ADMIN) {
    return
  }

  const url =
    user.role === UserRole.SUPER_ADMIN
      ? `/branchs`
      : `/branchs?branchMasterId=${user.branchMasterId}`
  const { data, error } = await useFetch<BranchResp[]>('GET', url)

  if (!data || data.errorCode || error) {
    alert('cannot get branches')
    return
  } else {
    branches.value = data.map((d) => {
      return {
        ...d,
        branchUrl: new URL(`../assets/branch-imgs/branch${d.id}.jpg`, import.meta.url).href
      }
    })
  }
}

const getSoldProduct = async () => {
  const { data, error } = await useFetch<SoldProductResp[]>(
    'POST',
    '/branch-products/sold-products-amount',
    formData.value
  )

  if (!data || data.errorCode || error) {
    alert('cannot get sell data')
    return
  }

  if (data.length && data[0].sold !== '0') {
    bestSeller.value = data.slice(0, 5)
    soldProducts.value = data.slice(5)
  } else {
    bestSeller.value = []
    soldProducts.value = data
    showAllProduct.value = true
  }
}

watch(
  formData,
  async () => {
    await getSoldProduct()
  },
  { deep: true }
)
</script>
