import type { Raid, RaidParticipant } from "@prisma/client"
import type { IRaidRepository, RaidWithRelations, RaidCreateInput } from "../interfaces/iraid.repository.js"
import { prisma } from "../lib/prisma.js"

export class PrismaRaidRepository implements IRaidRepository {
  async create(data: RaidCreateInput): Promise<Raid> {
    return prisma.raid.create({ data })
  }

  async findById(id: string): Promise<RaidWithRelations | null> {
    return prisma.raid.findUnique({
      where: { id },
      include: {
        boss: true,
        participants: {
          include: {
            user: { select: { id: true, nickname: true, level: true } },
          },
        },
      },
    }) as Promise<RaidWithRelations | null>
  }

  async findParticipant(raidId: string, userId: string): Promise<RaidParticipant | null> {
    return prisma.raidParticipant.findUnique({
      where: { raidId_userId: { raidId, userId } },
    })
  }

  async addParticipant(raidId: string, userId: string): Promise<RaidParticipant> {
    return prisma.raidParticipant.create({ data: { raidId, userId } })
  }

  async updateRaidStatus(id: string, status: string, currentHp?: number): Promise<Raid> {
    return prisma.raid.update({
      where: { id },
      data: { status, ...(currentHp !== undefined ? { currentHp } : {}) },
    })
  }

  async findAll(page: number, limit: number): Promise<{ data: RaidWithRelations[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.raid.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          boss: true,
          participants: {
            include: {
              user: { select: { id: true, nickname: true, level: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.raid.count(),
    ])
    return { data, total } as { data: RaidWithRelations[]; total: number }
  }
}
