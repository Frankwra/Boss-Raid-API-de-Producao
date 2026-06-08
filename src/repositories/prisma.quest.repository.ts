import type { Quest, PlayerQuest } from "@prisma/client"
import type { IQuestRepository, QuestCreateInput, QuestUpdateInput } from "../interfaces/iquest.repository.js"
import { prisma } from "../lib/prisma.js"

export class PrismaQuestRepository implements IQuestRepository {
  async create(data: QuestCreateInput): Promise<Quest> {
    return prisma.quest.create({ data })
  }

  async findAll(page: number, limit: number): Promise<{ data: Quest[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.quest.findMany({ skip: (page - 1) * limit, take: limit }),
      prisma.quest.count(),
    ])
    return { data, total }
  }

  async findById(id: string): Promise<Quest | null> {
    return prisma.quest.findUnique({ where: { id } })
  }

  async update(id: string, data: QuestUpdateInput): Promise<Quest> {
    return prisma.quest.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await prisma.quest.delete({ where: { id } })
  }

  async findPlayerQuest(userId: string, questId: string): Promise<PlayerQuest | null> {
    return prisma.playerQuest.findUnique({ where: { userId_questId: { userId, questId } } })
  }

  async createPlayerQuest(userId: string, questId: string): Promise<PlayerQuest> {
    return prisma.playerQuest.create({ data: { userId, questId } })
  }

  async updatePlayerQuest(id: string, completed: boolean): Promise<PlayerQuest> {
    return prisma.playerQuest.update({ where: { id }, data: { completed } })
  }

  async findCompletedQuestIds(userId: string): Promise<string[]> {
    const records = await prisma.playerQuest.findMany({ where: { userId, completed: true }, select: { questId: true } })
    return records.map(r => r.questId)
  }
}
