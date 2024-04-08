import type { UserRole } from '@/constant.ts/user.enum'

export type UserResponse = {
  token: string
  userId: string
  username: string
  role: string
  branchId: number
  branchMasterId: number
}

export type UserProfile = {
  username: string
  role: UserRole
  branchMasterId?: number
  branchId?: number
  telNo?: string
}
