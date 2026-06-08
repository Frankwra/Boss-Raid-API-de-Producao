import { describe, it, expect, beforeEach } from "vitest"
import { BossService, BossError } from "./boss.service.js"
import { InMemoryBossRepository } from "../repositories/inmemory.boss.repository.js"

describe("BossService", () => {
  let service: BossService
  let repo: InMemoryBossRepository

  beforeEach(() => {
    repo = new InMemoryBossRepository()
    service = new BossService(repo)
  })

  describe("create", () => {
    it("deve criar um boss com sucesso", async () => {
      const boss = await service.create({
        name: "Dragão Vermelho",
        hp: 1000,
        damage: 50,
        xpReward: 500,
        levelRequired: 5,
      })

      expect(boss.id).toBeTruthy()
      expect(boss.name).toBe("Dragão Vermelho")
      expect(boss.hp).toBe(1000)
      expect(boss.damage).toBe(50)
      expect(boss.xpReward).toBe(500)
      expect(boss.levelRequired).toBe(5)
    })
  })

  describe("list", () => {
    it("deve listar bosses paginado", async () => {
      for (let i = 1; i <= 5; i++) {
        await service.create({
          name: `Boss ${i}`,
          hp: 100 * i,
          damage: 10 * i,
          xpReward: 50 * i,
          levelRequired: i,
        })
      }

      const result = await service.list(1, 2)

      expect(result.data).toHaveLength(2)
      expect(result.meta.total).toBe(5)
      expect(result.meta.page).toBe(1)
      expect(result.meta.totalPages).toBe(3)
    })
  })

  describe("getById", () => {
    it("deve retornar boss por ID", async () => {
      const created = await service.create({
        name: "Boss Único",
        hp: 500,
        damage: 25,
        xpReward: 200,
        levelRequired: 3,
      })

      const boss = await service.getById(created.id)

      expect(boss.id).toBe(created.id)
      expect(boss.name).toBe("Boss Único")
    })

    it("deve lançar erro 404 se boss não existir", async () => {
      await expect(service.getById("id-inexistente")).rejects.toThrowError(
        new BossError("Boss não encontrado", 404),
      )
    })
  })

  describe("update", () => {
    it("deve atualizar um boss", async () => {
      const created = await service.create({
        name: "Boss Original",
        hp: 100,
        damage: 10,
        xpReward: 50,
        levelRequired: 1,
      })

      const updated = await service.update(created.id, {
        name: "Boss Atualizado",
        hp: 200,
      })

      expect(updated.name).toBe("Boss Atualizado")
      expect(updated.hp).toBe(200)
      expect(updated.damage).toBe(10)
    })

    it("deve lançar erro 404 ao atualizar boss inexistente", async () => {
      await expect(
        service.update("id-inexistente", { name: "Novo" }),
      ).rejects.toThrowError(new BossError("Boss não encontrado", 404))
    })
  })

  describe("delete", () => {
    it("deve deletar um boss", async () => {
      const created = await service.create({
        name: "Boss para Deletar",
        hp: 100,
        damage: 10,
        xpReward: 50,
        levelRequired: 1,
      })

      await service.delete(created.id)

      await expect(service.getById(created.id)).rejects.toThrowError(
        new BossError("Boss não encontrado", 404),
      )
    })
  })
})
