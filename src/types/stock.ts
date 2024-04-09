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

export type BranchStockResp = {
  productType: string
  stocks: {
    id: number
    branchMasterId: number
    productId: number
    productName: string
    productTypeId: number
    amount: number
  }[]
}
