<template>
  <div class="h-screen">
    <NavBar :name="name"></NavBar>
    <div
      v-if="name === 'Login'"
      class="flex items-center h-[calc(100vh-70px)] p-6 bg-[--vt-c-white-soft]"
    >
      <RouterView />
    </div>
    <div v-else-if="name === 'Profile' || name === 'Edit Profile'">
      <RouterView />
    </div>
    <div v-else>
      <div class="flex relative flex-col border-none px-6 pt-4 pb-[70px] bg-[--vt-c-white-soft]">
        <RouterView />
      </div>

      <FooterBar :focus="name"></FooterBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import { computed } from 'vue'

const route = useRouter()
const name = computed(() => route.currentRoute.value.name?.toString() ?? '')
</script>
