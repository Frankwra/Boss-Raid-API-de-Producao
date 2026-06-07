import type { User } from "@prisma/client"
import type { IUserRepository, UserCreateInput, UserUpdateInput } from "../interfaces/iuser.repository.js"

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = []

  async create(data: UserCreateInput): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      avatar: null,
      xp: 0,
      level: 1,
      role: "player",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null
  }

  async update(id: string, data: UserUpdateInput): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error("User not found")

    this.users[index] = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    }
    return this.users[index]!
  }
}
