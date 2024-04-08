<template>
  <div class="h-[35px] text-sm">
    <div class="relative">
      <VDropdown v-model:shown="isOpen">
        <input
          ref="input"
          :value="props.modelValue.text"
          :id="props.id"
          :type="props.type"
          @keyup="manageDropDown"
          @input="insert(($event.target as HTMLInputElement).value ?? '')"
          class="block w-full rounded-lg border text-xs placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          :style="[`padding-left:12px`, `padding-right:36px`, 'box-shadow:none !important']"
        />
        <template #popper>
          <ul class="max-h-[200px] w-full space-y-1 p-1 text-xs">
            <li
              v-for="(item, index) in searchResults"
              :key="index"
              :value="item.text"
              class="cursor-pointer rounded py-1 px-2 hover:bg-primary/10"
              :class="{
                'rounded bg-primary/10 text-primary hover:bg-primary/10': index === focusItem
              }"
              @click="selectItem(item)"
            >
              {{ item.text }}
            </li>
          </ul>
        </template>
      </VDropdown>
      <span
        ref="append"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <Icon name="ic:baseline-unfold-more"></Icon>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
type SelectType = { text: string; value: number; selected?: boolean }
interface Props {
  modelValue: any
  type?: string
  id?: string
  hideDetail?: boolean
  autoComplete?: boolean
  items: SelectType[]
}
const emit = defineEmits(['update:modelValue'])
const focusItem = ref(-1)
const props = withDefaults(defineProps<Props>(), {
  id: 'autocomplete',
  type: 'text',
  hideDetail: false,
  errors: () => [],
  autoComplete: false,
  items: () => []
})

const input = ref(null)

const isOpen = ref(false)

const selectItem = (value: SelectType) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const insert = (text: string) => {
  isOpen.value = true
  const item = searchResults.value.find((sr) => sr.text === text)
  emit('update:modelValue', item ?? { text, value: -1 })
}
const searchResults = computed(() => {
  if (!props.modelValue.text) return props.items
  return props.items.filter((item) =>
    item.text?.toLowerCase().includes(props.modelValue?.text?.toLowerCase())
  )
})

const manageDropDown = (event: KeyboardEvent) => {
  //keydown
  if (event.keyCode === 40 && !isOpen.value) {
    isOpen.value = true
  }
  if (event.keyCode === 40 && isOpen.value) {
    focusItem.value += 1
  }
  //tab
  if (event.keyCode === 9) {
    isOpen.value = false
  }

  if (event.keyCode === 13 && focusItem.value > -1) {
    selectItem(searchResults.value[focusItem.value])
    isOpen.value = false
  }
}

watch(isOpen, async (newV: boolean) => {
  const el = document.getElementById(props.id)
  if (!el || !newV) {
    focusItem.value = -1
    return
  }
  setTimeout(() => {
    el.focus()
  }, 100)
})
</script>
