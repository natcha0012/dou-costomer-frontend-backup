export type BranchResp = {
  id: number
  name: string
  branchMasterId: number
}

export type SoldProductResp = {
  sold: string
  productId: number
  productName: string
  percent: string
}

export type BranchMasterDetailResp = {
  id: number
  name: string
  Branch: {
    id: number
    name: string
    branchMasterId: number
  }[]
}
