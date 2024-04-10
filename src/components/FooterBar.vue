<template>
  <footer
    class="h-[70px] w-full fixed bottom-0 bg-white p-2 text-base grid justify-items-center content-center grid-cols-4 gap-3"
  >
    <RouterLink to="/stock">
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
    <RouterLink to="/order">
      <div
        v-if="props.focus === 'Order'"
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
    <RouterLink to="/bills">
      <div
        v-if="props.focus === 'Bills'"
        class="w-fit flex justify-center items-center flex-col gap-1"
      >
        <IconBills style="color: red"></IconBills>
        <span class="text-xs text-red-500">Bills</span>
      </div>
      <div v-else class="w-fit flex justify-center items-center flex-col gap-1">
        <IconBills></IconBills>
        <span class="text-xs">Bills</span>
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
import IconBills from '@/components/icons/IconBills.vue'

const { user } = useAuthStore()
const props = defineProps<{
  focus: string
}>()
</script>
