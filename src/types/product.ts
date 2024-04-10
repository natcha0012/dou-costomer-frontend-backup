export type ProductTypeResp = {
  id: number
  name: string
}

export type ProductResp = {
  id: number
  name: string
  price: string
  limit: number
  productTypeId: number
  stockLeft: number
  inCart?: number
  input?: string
  showError?: boolean
}
