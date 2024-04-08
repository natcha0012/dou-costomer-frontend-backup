export enum OrderStatus {
  IN_CART = 'IN_CART',
  ORDER_PLACED = 'ORDER_PLACED',
  PACKING = 'PACKING',
  PACKED = 'PACKED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  PRODUCT_PROBLEMS = 'PRODUCT_PROBLEMS',
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  WAITING_FOR_APPROVED = 'WAITING_FOR_APPROVED',
  CLAIM = 'CLAIM',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED'
}

export const OrderThaiStatus: Record<OrderStatus, string> = {
  IN_CART: 'อยู่ในตะกร้า',
  ORDER_PLACED: 'ยังไม่จัดสินค้า',
  PACKING: 'กำลังจัดสินค้า',
  PACKED: 'บรรจุสินค้าเรียบร้อย',
  DELIVERING: 'กำลังจัดส่งสินค้า',
  DELIVERED: 'จัดส่งสินค้าสำเร็จ',
  PRODUCT_PROBLEMS: 'จัดส่งสินค้ามีปัญหา',
  WAITING_FOR_PAYMENT: 'รอชำระเงิน',
  WAITING_FOR_APPROVED: 'รอตรวจสลิปการโอนเงิน',
  CLAIM: 'สินค้ามีปัญหา(เคลม)',
  SUCCESS: 'สำเร็จ',
  CANCELED: 'ยกเลิก'
}
