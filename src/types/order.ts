import type { OrderStatus } from '@/constant.ts/order.enum'

export type ListOrderResponse = {
  all: OrderResponse[]
  issue: OrderResponse[]
  action: OrderResponse[]
  waiting: OrderResponse[]
  success: OrderResponse[]
}

export type OrderResponse = {
  orderId: string
  date: string
  status: OrderStatus
  branchId: number
  branchName: string
}

export type GetOrderByIDResp = {
  id: number
  balance: string
  branchId: number
  branchMasterId: number
  branchName: string
  createdAt: string
  updatedAt: string
  deliverId: number
  packingId: number
  remark: string
  status: OrderStatus
  orderDetail: { productType: string; products: ProductDetail[] }[]
  spoiledProducts: ProductDetail[]
}

export type ProductDetail = {
  amount: number
  balance: number
  pricePerOne: number
  productId: number
  productName: string
  confirm?: boolean
}

export type AddInCartOrderReq = {
  orders: {
    productId: number
    amount: number
  }[]
}

export type PreviewOrderItems = {
  productType: string
  products: {
    id: number
    name: string
    amount: number
    pricePerAmount: string
    balance?: string
  }[]
}
