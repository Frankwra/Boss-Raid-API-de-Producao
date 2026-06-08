import type { Quest, PlayerQuest } from "@prisma/client"

export type QuestCreateInput = {
  title: string
  description: string
  difficulty: number
  xpReward: number
}

export type QuestUpdateInput = {
  title?: string
  description?: string
  difficulty?: number
  xpReward?: number
}

export interface IQuestRepository {
  create(data: QuestCreateInput): Promise<Quest>
  findAll(page: number, limit: number): Promise<{ data: Quest[]; total: number }>
  findById(id: string): Promise<Quest | null>
  update(id: string, data: QuestUpdateInput): Promise<Quest>
  delete(id: string): Promise<void>
  findPlayerQuest(userId: string, questId: string): Promise<PlayerQuest | null>
  createPlayerQuest(userId: string, questId: string): Promise<PlayerQuest>
  updatePlayerQuest(id: string, completed: boolean): Promise<PlayerQuest>
  findCompletedQuestIds(userId: string): Promise<string[]>
}
