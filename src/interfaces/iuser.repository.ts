import type { User } from "@prisma/client"

export type UserCreateInput = {
  email: string
  password: string
  nickname: string
}

export type UserUpdateInput = {
  nickname?: string
  avatar?: string
}

export interface IUserRepository {
  create(data: UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  update(id: string, data: UserUpdateInput): Promise<User>
}
