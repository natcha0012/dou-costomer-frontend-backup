<template>
  <div v-if="visible" class="modaloverlay" @click.self="close()">
    <div class="modal-content">
      <div class="text-xl text-center my-3 font-bold">หมายเหตุ</div>
      <div class="flex flex-col">
        <div>Order ID: {{ props.modalData?.orderId }}</div>
        <div>รายการ: {{ props.modalData?.productName }}</div>
        <div>รายละเอียด:</div>
        <textarea v-model="remark" class="border mt-1 p-2"></textarea>
        <div class="w-full flex justify-end gap-1">
          <button @click="close()" class="rounded-lg border-2 p-2 mt-3 text-white bg-red-500">
            ปิด
          </button>
          <button @click="save()" class="rounded-lg border-2 p-2 mt-3 text-white bg-black">
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'


type ModalData = {
  orderId: number
  productId: number
  productName: string
  remark?: string
}
export type OutputRemarkEvent = {
  isUpdate: boolean
  data?: {
    productId: number
    remark?: string
  }
}
const remark = ref('')
const props = defineProps<{ visible: boolean; modalData: ModalData }>()

const emit = defineEmits<{ close: [OutputRemarkEvent] }>()
const close = () => {
  emit('close', { isUpdate: false })
}
const save = () => {
  emit('close', {
    isUpdate: true,
    data: { productId: props.modalData.productId, remark: remark.value }
  })
}

watch(() => props.modalData.remark, (newVal) => {
  if (!newVal || newVal.length === 0) {
    return
  }
  remark.value = newVal
}, { once: true })
</script>

<style>
.modaloverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 300px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
