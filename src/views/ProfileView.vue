<template>
  <div class="flex flex-col bg-white items-center px-6 py-4 gap-2">
    <div
      class="flex justify-center overflow-hidden rounded-full w-32 h-32 border-white border-[6px] shadow-md"
    >
      <img
        class="object-cover"
        :src="branchUrl"
        :alt="`branch-master-${userProfile?.branchMasterId}`"
      />
    </div>
    <div>โต้ว สาขา {{ branchMasterDetail?.name }}</div>
    <div class="text-xs text-gray-400 flex flex-col gap-1">
      <div>Role: {{ userProfile?.role }}</div>
      <div>TelNo: {{ userProfile?.telNo || '-' }}</div>
    </div>
    <RouterLink to="/edit-profile"
      ><div class="text-sm underline underline-offset-4 text-[--vt-primary-blue]">
        Edit Profile
      </div></RouterLink
    >
  </div>
  <div class="flex flex-col bg-[--vt-c-white-soft] min-h-[70vh] px-6 py-5">
    <div
      class="flex flex-row relative gap-3 items-center text-sm text-gray-500 hover:bg-gray-300 p-2 rounded-md"
    >
      <button class="bg-[#FF0000] hover:bg-red-600 rounded-lg p-[6px]">
        <IconSupport class="text-white h-4 w-4"></IconSupport>
      </button>
      <p>ติดต่อฝ่ายบริการช่วยเหลือของโต้ว</p>
      <div class="absolute right-1">
        <IconChevronRight class="text-gray-400"></IconChevronRight>
      </div>
    </div>
    <div
      v-for="(branch, index) in branchMasterDetail?.Branch"
      :key="index"
      class="flex flex-row relative gap-3 items-center text-sm text-gray-500 hover:bg-gray-300 p-2 rounded-md"
    >
      <button class="hover:bg-red-600 rounded-lg p-[6px]" style="background-color: orange">
        <IconSupport class="text-white h-4 w-4"></IconSupport>
      </button>
      <p>ติดต่อสาขา {{ branch.name }}</p>
      <div class="absolute right-1">
        <IconChevronRight class="text-gray-400"></IconChevronRight>
      </div>
    </div>
    <div
      class="flex flex-row relative gap-3 items-center text-sm text-gray-500 hover:bg-gray-300 p-2 rounded-md"
      @click="authStore.logout()"
    >
      <IconLogout class="rounded-lg"></IconLogout>

      <p>Logout</p>
      <div class="absolute right-1">
        <IconChevronRight class="text-gray-400"></IconChevronRight>
      </div>
    </div>
  </div>
  <FooterBar focus="Profile"></FooterBar>
</template>
<script setup lang="ts">
import { useFetch } from '@/composables/fetch'
import { useAuthStore } from '@/stores/auth-store'
import type { BranchMasterDetailResp } from '@/types/branch'
import type { UserProfile } from '@/types/user'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import IconSupport from '@/components/icons/IconSupport.vue'
import IconChevronRight from '@/components/icons/IconChevronRight.vue'
import IconLogout from '@/components/icons/IconLogout.vue'
import FooterBar from '@/components/FooterBar.vue'

const authStore = useAuthStore()
const branchUrl = ref(
  new URL(
    `../assets/branch-imgs/branch-master${authStore.user?.branchMasterId}.jpeg`,
    import.meta.url
  ).href
)
const userProfile = ref()

const branchMasterDetail = ref<BranchMasterDetailResp>()

onMounted(async () => {
  await getBranchMaster()
  await getProfile()
})

const getBranchMaster = async () => {
  const { data, error } = await useFetch<BranchMasterDetailResp>(
    'GET',
    '/branch-master/branch-master-detail'
  )

  if (!data || data.errorCode || error) {
    alert('cannot get branch master detail')
    return
  } else {
    branchMasterDetail.value = data
  }
}

const getProfile = async () => {
  const { data, error } = await useFetch<UserProfile>('GET', '/users/profile')
  if (!data || data.errorCode || error) {
    alert('cannot get user profile')
    return
  } else {
    userProfile.value = data
  }
}
</script>
