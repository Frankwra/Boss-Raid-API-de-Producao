import type { Raid, RaidParticipant, Boss, User } from "@prisma/client"
import type { IRaidRepository, RaidWithRelations, RaidCreateInput } from "../interfaces/iraid.repository.js"

export class InMemoryRaidRepository implements IRaidRepository {
  private raids: Raid[] = []
  private participants: RaidParticipant[] = []
  private bosses: Boss[] = []
  private users: User[] = []

  setBosses(bosses: Boss[]) {
    this.bosses = bosses
  }

  setUsers(users: User[]) {
    this.users = users
  }

  async create(data: RaidCreateInput): Promise<Raid> {
    const raid: Raid = {
      id: crypto.randomUUID(),
      bossId: data.bossId,
      status: "open",
      currentHp: data.currentHp,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.raids.push(raid)
    return raid
  }

  async findById(id: string): Promise<RaidWithRelations | null> {
    const raid = this.raids.find((r) => r.id === id)
    if (!raid) return null

    const boss = this.bosses.find((b) => b.id === raid.bossId)
    const raidParticipants = this.participants.filter((p) => p.raidId === id)

    return {
      ...raid,
      boss: boss!,
      participants: raidParticipants.map((p) => ({
        ...p,
        user: (() => {
          const u = this.users.find((u) => u.id === p.userId)
          return { id: u!.id, nickname: u!.nickname, level: u!.level }
        })(),
      })),
    } as RaidWithRelations
  }

  async findParticipant(raidId: string, userId: string): Promise<RaidParticipant | null> {
    return this.participants.find((p) => p.raidId === raidId && p.userId === userId) ?? null
  }

  async addParticipant(raidId: string, userId: string): Promise<RaidParticipant> {
    const p: RaidParticipant = {
      id: crypto.randomUUID(),
      raidId,
      userId,
      damage: 0,
      joinedAt: new Date(),
    }
    this.participants.push(p)
    return p
  }

  async updateRaidStatus(id: string, status: string, currentHp?: number): Promise<Raid> {
    const index = this.raids.findIndex((r) => r.id === id)
    if (index === -1) throw new Error("Raid not found")
    this.raids[index] = {
      ...this.raids[index],
      status,
      ...(currentHp !== undefined ? { currentHp } : {}),
      updatedAt: new Date(),
    }
    return this.raids[index]!
  }

  async findAll(page: number, limit: number): Promise<{ data: Raid[]; total: number }> {
    const total = this.raids.length
    const start = (page - 1) * limit
    const data = this.raids.slice(start, start + limit)
    return { data, total }
  }
}
