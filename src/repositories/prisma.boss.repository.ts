import type { Boss } from "@prisma/client"
import type { IBossRepository, BossCreateInput, BossUpdateInput } from "../interfaces/iboss.repository.js"
import { prisma } from "../lib/prisma.js"

export class PrismaBossRepository implements IBossRepository {
  async create(data: BossCreateInput): Promise<Boss> {
    return prisma.boss.create({ data })
  }

  async findAll(page: number, limit: number): Promise<{ data: Boss[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.boss.findMany({ skip: (page - 1) * limit, take: limit }),
      prisma.boss.count(),
    ])
    return { data, total }
  }

  async findById(id: string): Promise<Boss | null> {
    return prisma.boss.findUnique({ where: { id } })
  }

  async update(id: string, data: BossUpdateInput): Promise<Boss> {
    return prisma.boss.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.boss.delete({ where: { id } })
  }
}
