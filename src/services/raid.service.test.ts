import { describe, it, expect, beforeEach } from "vitest"
import { RaidService, RaidError } from "./raid.service.js"
import { InMemoryRaidRepository } from "../repositories/inmemory.raid.repository.js"
import { InMemoryUserRepository } from "../repositories/inmemory.user.repository.js"
import { InMemoryBossRepository } from "../repositories/inmemory.boss.repository.js"
import type { User } from "@prisma/client"

describe("RaidService", () => {
  let service: RaidService
  let raidRepo: InMemoryRaidRepository
  let userRepo: InMemoryUserRepository
  let bossRepo: InMemoryBossRepository
  let player: User

  beforeEach(async () => {
    raidRepo = new InMemoryRaidRepository()
    userRepo = new InMemoryUserRepository()
    bossRepo = new InMemoryBossRepository()
    service = new RaidService(raidRepo, userRepo, bossRepo)

    player = await userRepo.create({
      email: "player@email.com",
      password: "hashed",
      nickname: "Player",
    })

    raidRepo.setUsers([player])
  })

  describe("create", () => {
    it("deve criar uma raid com sucesso", async () => {
      const boss = await bossRepo.create({
        name: "Dragão Vermelho",
        hp: 100,
        damage: 50,
        xpReward: 200,
        levelRequired: 1,
      })
      raidRepo.setBosses([boss])

      const raid = await service.create(player.id, boss.id)

      expect(raid.id).toBeTruthy()
      expect(raid.bossId).toBe(boss.id)
      expect(raid.status).toBe("open")
      expect(raid.currentHp).toBe(boss.hp)
    })

    it("deve lançar erro 403 se level do usuário for insuficiente", async () => {
      const bossAlto = await bossRepo.create({
        name: "Boss Difícil",
        hp: 500,
        damage: 100,
        xpReward: 1000,
        levelRequired: 10,
      })
      raidRepo.setBosses([bossAlto])

      await expect(service.create(player.id, bossAlto.id)).rejects.toThrowError(
        new RaidError("Nível insuficiente para enfrentar este boss", 403),
      )
    })
  })

  describe("join", () => {
    it("deve entrar em uma raid existente", async () => {
      const boss = await bossRepo.create({
        name: "Dragão Vermelho",
        hp: 100,
        damage: 50,
        xpReward: 200,
        levelRequired: 1,
      })
      raidRepo.setBosses([boss])

      const raid = await service.create(player.id, boss.id)

      const jogador2 = await userRepo.create({
        email: "jogador2@email.com",
        password: "hashed",
        nickname: "Jogador2",
      })
      raidRepo.setUsers([player, jogador2])

      const result = await service.join(raid.id, jogador2.id)

      expect(result.message).toBe("Você entrou na raid!")
    })

    it("deve lançar erro 409 se já estiver participando", async () => {
      const boss = await bossRepo.create({
        name: "Dragão Vermelho",
        hp: 100,
        damage: 50,
        xpReward: 200,
        levelRequired: 1,
      })
      raidRepo.setBosses([boss])

      const raid = await service.create(player.id, boss.id)

      await expect(service.join(raid.id, player.id)).rejects.toThrowError(
        new RaidError("Você já está participando desta raid", 409),
      )
    })
  })

  describe("attack", () => {
    it("deve atacar o boss e reduzir o HP", async () => {
      const boss = await bossRepo.create({
        name: "Dragão Vermelho",
        hp: 100,
        damage: 50,
        xpReward: 200,
        levelRequired: 1,
      })
      raidRepo.setBosses([boss])

      const raid = await service.create(player.id, boss.id)

      if (raid.status === "open") {
        await raidRepo.updateRaidStatus(raid.id, "in_progress", raid.currentHp)
      }

      const result = await service.attack(raid.id, player.id)

      expect(result.dano).toBe(player.level * 10)
      expect(result.hpRestante).toBeLessThan(boss.hp)
    })

    it("deve derrotar o boss ao reduzir HP a 0", async () => {
      const bossFraco = await bossRepo.create({
        name: "Boss Fraco",
        hp: 10,
        damage: 5,
        xpReward: 50,
        levelRequired: 1,
      })
      raidRepo.setBosses([bossFraco])

      const raid = await service.create(player.id, bossFraco.id)

      if (raid.status === "open") {
        await raidRepo.updateRaidStatus(raid.id, "in_progress", raid.currentHp)
      }

      const result = await service.attack(raid.id, player.id)

      expect(result.hpRestante).toBe(0)
      expect(result.derrotado).toBe(true)
      expect(result.xpGanho).toBeGreaterThan(0)
    })
  })
})
