import type { IBossRepository, BossCreateInput, BossUpdateInput } from "../interfaces/iboss.repository.js"
import type { PaginatedResult } from "../plugins/pagination.js"

export class BossService {
  constructor(private readonly bossRepository: IBossRepository) {}

  async create(data: BossCreateInput) {
    return this.bossRepository.create(data)
  }

  async list(page: number, limit: number): Promise<PaginatedResult<unknown>> {
    const { data, total } = await this.bossRepository.findAll(page, limit)
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
    const boss = await this.bossRepository.findById(id)
    if (!boss) {
      throw new BossError("Boss não encontrado", 404)
    }
    return boss
  }

  async update(id: string, data: BossUpdateInput) {
    await this.getById(id)
    return this.bossRepository.update(id, data)
  }

  async delete(id: string) {
    await this.getById(id)
    await this.bossRepository.delete(id)
  }
}

export class BossError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = "BossError"
  }
}
