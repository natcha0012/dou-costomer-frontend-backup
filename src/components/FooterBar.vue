<template>
  <footer
    class="h-[70px] w-full fixed bottom-0 bg-white p-2 text-base grid justify-items-center content-center grid-cols-5 gap-3"
  >
    <RouterLink to="/stock" v-if="user?.role !== UserRole.DELIVER">
      <div
        v-if="props.focus === 'My Stock'"
        class="w-fit flex justify-center items-center flex-col gap-1"
      >
        <img class="h-[1.5em]" src="../assets/footer-icon/stock-red.png" />
        <span class="text-xs text-red-500">Stock</span>
      </div>
      <div v-else class="w-fit flex justify-center items-center flex-col gap-1">
        <img class="h-[1.5em]" src="../assets/footer-icon/stock.png" />
        <span class="text-xs">Stock</span>
      </div>
    </RouterLink>
    <RouterLink to="/production" v-if="user?.role !== UserRole.DELIVER">
      <div
        v-if="props.focus === 'Production'"
        class="w-fit flex justify-center items-center flex-col gap-1"
      >
        <img class="h-[1.5em]" src="../assets/footer-icon/book-red.png" />
        <span class="text-xs text-red-500">Production</span>
      </div>
      <div v-else class="w-fit flex justify-center items-center flex-col gap-1">
        <img class="h-[1.5em]" src="../assets/footer-icon/book.png" />
        <span class="text-xs">Production</span>
      </div>
    </RouterLink>
    <RouterLink to="/branchs" v-if="user?.role !== UserRole.DELIVER">
      <div
        v-if="props.focus === 'Our Branches'"
        class="w-fit flex justify-center items-center flex-col gap-1"
      >
        <img class="h-[1.5em]" src="../assets/footer-icon/store-red.png" />
        <span class="text-xs text-red-500">Branches</span>
      </div>
      <div v-else class="w-fit flex justify-center items-center flex-col gap-1">
        <img class="h-[1.5em]" src="../assets/footer-icon/store.png" />
        <span class="text-xs">Branches</span>
      </div>
    </RouterLink>
    <RouterLink to="/orders">
      <div
        v-if="props.focus === 'Orders'"
        class="w-fit flex justify-center items-center flex-col gap-1"
      >
        <img class="h-[1.5em]" src="../assets/footer-icon/bag-red.png" />
        <span class="text-xs text-red-500">Order</span>
      </div>
      <div v-else class="w-fit flex justify-center items-center flex-col gap-1">
        <img class="h-[1.5em]" src="../assets/footer-icon/bag.png" />
        <span class="text-xs">Order</span>
      </div>
    </RouterLink>
    <RouterLink to="/profile">
      <div
        v-if="props.focus === 'Profile'"
        class="w-fit flex justify-center items-center flex-col gap-1"
      >
        <img class="h-[1.5em]" src="../assets/footer-icon/user-red.png" />
        <span class="text-xs text-red-500">Profile</span>
      </div>
      <div v-else class="w-fit flex justify-center items-center flex-col gap-1">
        <img class="h-[1.5em]" src="../assets/footer-icon/user.png" />
        <span class="text-xs">Profile</span>
      </div>
    </RouterLink>
  </footer>
</template>
<script setup lang="ts">
import { UserRole } from '@/constant.ts/user.enum'
import { useAuthStore } from '@/stores/auth-store'

const { user } = useAuthStore()
const props = defineProps<{
  focus: string
}>()
</script>
