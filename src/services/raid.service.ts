import type { IRaidRepository } from "../interfaces/iraid.repository.js"
import type { IUserRepository } from "../interfaces/iuser.repository.js"
import type { IBossRepository } from "../interfaces/iboss.repository.js"

export class RaidService {
  constructor(
    private readonly raidRepository: IRaidRepository,
    private readonly userRepository: IUserRepository,
    private readonly bossRepository: IBossRepository,
  ) {}

  async create(userId: string, bossId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new RaidError("Usuário não encontrado", 404)

    const boss = await this.findBoss(bossId)
    if (!boss) throw new RaidError("Boss não encontrado", 404)

    if (user.level < boss.levelRequired) {
      throw new RaidError("Nível insuficiente para enfrentar este boss", 403)
    }

    const raid = await this.raidRepository.create({
      bossId,
      currentHp: boss.hp,
    })

    await this.raidRepository.addParticipant(raid.id, userId)

    const created = await this.raidRepository.findById(raid.id)
    return created ?? raid
  }

  async join(raidId: string, userId: string) {
    const raid = await this.raidRepository.findById(raidId)
    if (!raid) throw new RaidError("Raid não encontrada", 404)

    if (raid.status !== "open") {
      throw new RaidError("Raid não está aberta para entrada", 400)
    }

    const alreadyIn = await this.raidRepository.findParticipant(raidId, userId)
    if (alreadyIn) {
      throw new RaidError("Você já está participando desta raid", 409)
    }

    await this.raidRepository.addParticipant(raidId, userId)

    return { message: "Você entrou na raid!" }
  }

  async attack(raidId: string, userId: string) {
    const raid = await this.raidRepository.findById(raidId)
    if (!raid) throw new RaidError("Raid não encontrada", 404)

    const participant = await this.raidRepository.findParticipant(raidId, userId)
    if (!participant) {
      throw new RaidError("Você não está participando desta raid", 403)
    }

    const user = await this.userRepository.findById(userId)
    if (!user) throw new RaidError("Usuário não encontrado", 404)

    if (raid.status !== "in_progress" && raid.status !== "open") {
      throw new RaidError("Raid já foi finalizada", 400)
    }

    if (raid.status === "open") {
      await this.raidRepository.updateRaidStatus(raidId, "in_progress", raid.currentHp)
    }

    const dano = user.level * 10
    const novoHp = Math.max(0, raid.currentHp - dano)

    if (novoHp <= 0) {
      await this.raidRepository.updateRaidStatus(raidId, "completed", 0)

      const participants = raid.participants.length
      const xpIndividual = Math.max(1, Math.floor(raid.boss.xpReward / participants))

      for (const p of raid.participants) {
        const pUser = await this.userRepository.findById(p.user.id)
        if (pUser) {
          const novoXp = pUser.xp + xpIndividual
          const novoLevel = Math.floor(novoXp / 200) + 1
          await this.userRepository.update(pUser.id, { xp: novoXp, level: novoLevel })
        }
      }

      return {
        dano,
        hpRestante: 0,
        derrotado: true,
        xpGanho: xpIndividual,
      }
    }

    await this.raidRepository.updateRaidStatus(raidId, "in_progress", novoHp)

    return {
      dano,
      hpRestante: novoHp,
      derrotado: false,
    }
  }

  async getStatus(raidId: string) {
    const raid = await this.raidRepository.findById(raidId)
    if (!raid) throw new RaidError("Raid não encontrada", 404)
    return raid
  }

  private async findBoss(bossId: string) {
    return this.bossRepository.findById(bossId)
  }
}

export class RaidError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = "RaidError"
  }
}
