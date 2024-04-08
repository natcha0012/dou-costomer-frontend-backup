<template>
  <div class="flex justify-end gap-3">
    <div>เลือกสาขา:</div>

    <select
      class="relative w-[120px] p-2 rounded-lg border text-sm focus:border-blue-500 focus:ring-blue-500"
      v-model="selectedBranch"
    >
      <option selected :value="0">ค่าตั้งต้น</option>
      <option v-for="item in branchs" :key="item.value" :value="item.value">
        {{ item.text }}
      </option>
    </select>
    <button
      v-if="!isEdit"
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
  <ProductTable
    :branch-master-id="user?.branchMasterId"
    :branch-id="selectedBranch"
    :is-edit="isEdit"
  ></ProductTable>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductTable from './ProductTable.vue'
import { useAuthStore } from '@/stores/auth-store'
import { useFetch } from '@/composables/fetch'
import type { BranchResp } from '@/types/branch'

const { user } = useAuthStore()
const isEdit = ref(false)
const branchs = ref<{ value: number; text: string }[]>([])
const selectedBranch = ref(0)

onMounted(async () => {
  await getBranchList()
})

const getBranchList = async () => {
  if (!user?.branchMasterId) {
    alert('cannot get user')
    return
  }
  const { data, error } = await useFetch<BranchResp[]>('GET', `/branchs?branchMasterId=${null}`)

  if (!data || data.errorCode || error) {
    alert('cannot get branchs')
    return
  } else {
    data.forEach((d) => {
      branchs.value.push({
        text: d.name,
        value: d.id
      })
    })
  }
}

const save = async () => {
  isEdit.value = false
}
</script>
