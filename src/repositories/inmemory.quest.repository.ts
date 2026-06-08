import type { Quest, PlayerQuest } from "@prisma/client"
import type { IQuestRepository, QuestCreateInput, QuestUpdateInput } from "../interfaces/iquest.repository.js"

export class InMemoryQuestRepository implements IQuestRepository {
  private quests: Quest[] = []
  private playerQuests: PlayerQuest[] = []

  async create(data: QuestCreateInput): Promise<Quest> {
    const quest: Quest = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      xpReward: data.xpReward,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.quests.push(quest)
    return quest
  }

  async findAll(page: number, limit: number): Promise<{ data: Quest[]; total: number }> {
    const total = this.quests.length
    const start = (page - 1) * limit
    const data = this.quests.slice(start, start + limit)
    return { data, total }
  }

  async findById(id: string): Promise<Quest | null> {
    return this.quests.find((q) => q.id === id) ?? null
  }

  async update(id: string, data: QuestUpdateInput): Promise<Quest> {
    const index = this.quests.findIndex((q) => q.id === id)
    if (index === -1) throw new Error("Quest not found")
    this.quests[index] = { ...this.quests[index], ...data, updatedAt: new Date() }
    return this.quests[index]!
  }

  async delete(id: string): Promise<void> {
    const index = this.quests.findIndex((q) => q.id === id)
    if (index !== -1) this.quests.splice(index, 1)
  }

  async findPlayerQuest(userId: string, questId: string): Promise<PlayerQuest | null> {
    return this.playerQuests.find((pq) => pq.userId === userId && pq.questId === questId) ?? null
  }

  async createPlayerQuest(userId: string, questId: string): Promise<PlayerQuest> {
    const pq: PlayerQuest = {
      id: crypto.randomUUID(),
      userId,
      questId,
      completed: false,
      createdAt: new Date(),
    }
    this.playerQuests.push(pq)
    return pq
  }

  async updatePlayerQuest(id: string, completed: boolean): Promise<PlayerQuest> {
    const index = this.playerQuests.findIndex((pq) => pq.id === id)
    if (index === -1) throw new Error("PlayerQuest not found")
    this.playerQuests[index] = { ...this.playerQuests[index], completed }
    return this.playerQuests[index]!
  }
}
