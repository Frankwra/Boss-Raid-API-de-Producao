import type { Boss } from "@prisma/client"

export type BossCreateInput = {
  name: string
  hp: number
  damage: number
  xpReward: number
  levelRequired: number
}

export type BossUpdateInput = {
  name?: string
  hp?: number
  damage?: number
  xpReward?: number
  levelRequired?: number
}

export interface IBossRepository {
  create(data: BossCreateInput): Promise<Boss>
  findAll(page: number, limit: number): Promise<{ data: Boss[]; total: number }>
  findById(id: string): Promise<Boss | null>
  update(id: string, data: BossUpdateInput): Promise<Boss>
  delete(id: string): Promise<void>
}
