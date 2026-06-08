import type { Raid, RaidParticipant, Boss } from "@prisma/client"

export type RaidWithRelations = Raid & {
  boss: Boss
  participants: (RaidParticipant & { user: { id: string; nickname: string; level: number } })[]
}

export type RaidCreateInput = {
  bossId: string
  currentHp: number
}

export interface IRaidRepository {
  create(data: RaidCreateInput): Promise<Raid>
  findById(id: string): Promise<RaidWithRelations | null>
  findParticipant(raidId: string, userId: string): Promise<RaidParticipant | null>
  addParticipant(raidId: string, userId: string): Promise<RaidParticipant>
  updateRaidStatus(id: string, status: string, currentHp?: number): Promise<Raid>
  findAll(page: number, limit: number): Promise<{ data: RaidWithRelations[]; total: number }>
}
