import { describe, it, expect, beforeEach } from "vitest"
import { QuestService, QuestError } from "./quest.service.js"
import { InMemoryQuestRepository } from "../repositories/inmemory.quest.repository.js"
import { InMemoryUserRepository } from "../repositories/inmemory.user.repository.js"
import { UserService } from "./user.service.js"

describe("QuestService", () => {
  let service: QuestService
  let repo: InMemoryQuestRepository
  let userService: UserService

  beforeEach(() => {
    repo = new InMemoryQuestRepository()
    const userRepo = new InMemoryUserRepository()
    userService = new UserService(userRepo)
    service = new QuestService(repo, userRepo)
  })

  describe("create", () => {
    it("deve criar uma quest com sucesso", async () => {
      const quest = await service.create({
        title: "Derrote o Goblin",
        description: "Vá até a floresta negra e derrote o goblin chefe",
        difficulty: 3,
        xpReward: 100,
      })

      expect(quest.id).toBeTruthy()
      expect(quest.title).toBe("Derrote o Goblin")
      expect(quest.difficulty).toBe(3)
      expect(quest.xpReward).toBe(100)
    })
  })

  describe("list", () => {
    it("deve listar quests paginado", async () => {
      for (let i = 1; i <= 5; i++) {
        await service.create({
          title: `Quest ${i}`,
          description: `Descrição da quest ${i}`,
          difficulty: 1,
          xpReward: 10,
        })
      }

      const result = await service.list(1, 2)

      expect(result.data).toHaveLength(2)
      expect(result.meta.total).toBe(5)
      expect(result.meta.page).toBe(1)
      expect(result.meta.limit).toBe(2)
      expect(result.meta.totalPages).toBe(3)
    })
  })

  describe("getById", () => {
    it("deve retornar quest por ID", async () => {
      const created = await service.create({
        title: "Quest Única",
        description: "Descrição única para teste",
        difficulty: 2,
        xpReward: 50,
      })

      const quest = await service.getById(created.id)

      expect(quest.id).toBe(created.id)
      expect(quest.title).toBe("Quest Única")
    })

    it("deve lançar erro 404 se quest não existir", async () => {
      await expect(service.getById("id-inexistente")).rejects.toThrowError(
        new QuestError("Quest não encontrada", 404),
      )
    })
  })

  describe("update", () => {
    it("deve atualizar uma quest", async () => {
      const created = await service.create({
        title: "Quest Original",
        description: "Descrição original da quest",
        difficulty: 1,
        xpReward: 10,
      })

      const updated = await service.update(created.id, {
        title: "Quest Atualizada",
        difficulty: 4,
      })

      expect(updated.title).toBe("Quest Atualizada")
      expect(updated.difficulty).toBe(4)
      expect(updated.xpReward).toBe(10)
    })

    it("deve lançar erro 404 ao atualizar quest inexistente", async () => {
      await expect(
        service.update("id-inexistente", { title: "Nova" }),
      ).rejects.toThrowError(new QuestError("Quest não encontrada", 404))
    })
  })

  describe("delete", () => {
    it("deve deletar uma quest", async () => {
      const created = await service.create({
        title: "Quest para Deletar",
        description: "Descrição para deleção",
        difficulty: 1,
        xpReward: 10,
      })

      await service.delete(created.id)

      await expect(service.getById(created.id)).rejects.toThrowError(
        new QuestError("Quest não encontrada", 404),
      )
    })
  })

  describe("complete", () => {
    it("deve completar quest e ganhar XP", async () => {
      const { user } = await userService.register({
        email: "player@email.com",
        password: "123456",
        nickname: "Player",
      })

      const quest = await service.create({
        title: "Missão de Teste",
        description: "Descrição da missão de teste",
        difficulty: 2,
        xpReward: 100,
      })

      const result = await service.complete(quest.id, user.id)

      expect(result.message).toBe("Quest completada com sucesso!")
      expect(result.xpGanho).toBe(100)
      expect(result.xpTotal).toBe(100)
      expect(result.level).toBe(1)
    })

    it("deve subir de nível ao acumular XP suficiente", async () => {
      const regrasNivel = [0, 100, 250, 500, 800]
      const { user } = await userService.register({
        email: "player@email.com",
        password: "123456",
        nickname: "Player",
      })

      const quest = await service.create({
        title: "Quest de XP Alto",
        description: "Descrição da quest de XP alto",
        difficulty: 5,
        xpReward: 300,
      })

      const result = await service.complete(quest.id, user.id)

      expect(result.xpGanho).toBe(300)
      expect(result.level).toBe(2)
    })

    it("deve lançar erro 409 se quest já foi completada", async () => {
      const { user } = await userService.register({
        email: "player@email.com",
        password: "123456",
        nickname: "Player",
      })

      const quest = await service.create({
        title: "Quest Única",
        description: "Descrição da quest única",
        difficulty: 1,
        xpReward: 50,
      })

      await service.complete(quest.id, user.id)

      await expect(service.complete(quest.id, user.id)).rejects.toThrowError(
        new QuestError("Quest já foi completada por este usuário", 409),
      )
    })
  })
})
