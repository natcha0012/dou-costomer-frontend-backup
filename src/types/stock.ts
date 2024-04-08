export type DailyStockReportType = {
  productType: string
  stocks: {
    id: string
    date: string
    totalIn: number
    totalOut: number
    stockBalance: number
    productId: number
    productName: string
    spoiledAmount: number
    productTypeId: number
  }[]
}
