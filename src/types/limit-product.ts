export type LimitProductResp = {
  productType: string
  products: { id: number; name: string; limit: number }[]
}
