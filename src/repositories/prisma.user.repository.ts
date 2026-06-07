import type { User } from "@prisma/client"
import type { IUserRepository, UserCreateInput, UserUpdateInput } from "../interfaces/iuser.repository.js"
import { prisma } from "../lib/prisma.js"

export class PrismaUserRepository implements IUserRepository {
  async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async update(id: string, data: UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }
}
