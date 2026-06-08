import type { Boss } from "@prisma/client"
import type { IBossRepository, BossCreateInput, BossUpdateInput } from "../interfaces/iboss.repository.js"

export class InMemoryBossRepository implements IBossRepository {
  private bosses: Boss[] = []

  async create(data: BossCreateInput): Promise<Boss> {
    const boss: Boss = {
      id: crypto.randomUUID(),
      name: data.name,
      hp: data.hp,
      damage: data.damage,
      xpReward: data.xpReward,
      levelRequired: data.levelRequired,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.bosses.push(boss)
    return boss
  }

  async findAll(page: number, limit: number): Promise<{ data: Boss[]; total: number }> {
    const total = this.bosses.length
    const start = (page - 1) * limit
    const data = this.bosses.slice(start, start + limit)
    return { data, total }
  }

  async findById(id: string): Promise<Boss | null> {
    return this.bosses.find((b) => b.id === id) ?? null
  }

  async update(id: string, data: BossUpdateInput): Promise<Boss> {
    const index = this.bosses.findIndex((b) => b.id === id)
    if (index === -1) throw new Error("Boss not found")
    this.bosses[index] = { ...this.bosses[index], ...data, updatedAt: new Date() }
    return this.bosses[index]!
  }

  async delete(id: string): Promise<void> {
    const index = this.bosses.findIndex((b) => b.id === id)
    if (index !== -1) this.bosses.splice(index, 1)
  }
}
