import type { IQuestRepository, QuestCreateInput, QuestUpdateInput } from "../interfaces/iquest.repository.js"
import type { IUserRepository } from "../interfaces/iuser.repository.js"
import type { PaginatedResult } from "../plugins/pagination.js"

export class QuestService {
  constructor(
    private readonly questRepository: IQuestRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async create(data: QuestCreateInput) {
    return this.questRepository.create(data)
  }

  async list(page: number, limit: number): Promise<PaginatedResult<unknown>> {
    const { data, total } = await this.questRepository.findAll(page, limit)
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getById(id: string) {
    const quest = await this.questRepository.findById(id)
    if (!quest) {
      throw new QuestError("Quest não encontrada", 404)
    }
    return quest
  }

  async update(id: string, data: QuestUpdateInput) {
    await this.getById(id)
    return this.questRepository.update(id, data)
  }

  async delete(id: string) {
    await this.getById(id)
    await this.questRepository.delete(id)
  }

  async complete(questId: string, userId: string) {
    const quest = await this.questRepository.findById(questId)
    if (!quest) {
      throw new QuestError("Quest não encontrada", 404)
    }

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new QuestError("Usuário não encontrado", 404)
    }

    const existing = await this.questRepository.findPlayerQuest(userId, questId)
    if (existing?.completed) {
      throw new QuestError("Quest já foi completada por este usuário", 409)
    }

    if (existing) {
      await this.questRepository.updatePlayerQuest(existing.id, true)
    } else {
      await this.questRepository.createPlayerQuest(userId, questId)
      const created = await this.questRepository.findPlayerQuest(userId, questId)
      if (created) {
        await this.questRepository.updatePlayerQuest(created.id, true)
      }
    }

    const novoXp = user.xp + quest.xpReward
    const novoLevel = Math.floor(novoXp / 200) + 1

    await this.userRepository.update(userId, { xp: novoXp, level: novoLevel })

    return {
      message: "Quest completada com sucesso!",
      xpGanho: quest.xpReward,
      xpTotal: novoXp,
      level: novoLevel,
    }
  }
}

export class QuestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = "QuestError"
  }
}
