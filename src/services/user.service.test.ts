import { describe, it, expect, beforeEach } from "vitest"
import { UserService, UserError } from "./user.service.js"
import { InMemoryUserRepository } from "../repositories/inmemory.user.repository.js"
import bcrypt from "bcryptjs"

describe("UserService", () => {
  let service: UserService
  let repo: InMemoryUserRepository

  beforeEach(() => {
    repo = new InMemoryUserRepository()
    service = new UserService(repo)
  })

  describe("register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const result = await service.register({
        email: "teste@email.com",
        password: "123456",
        nickname: "Testador",
      })

      expect(result.user).toBeDefined()
      expect(result.user.email).toBe("teste@email.com")
      expect(result.user.nickname).toBe("Testador")
      expect(result.token).toBeTruthy()
    })

    it("deve lançar erro 409 se email já existir", async () => {
      await service.register({
        email: "teste@email.com",
        password: "123456",
        nickname: "Testador",
      })

      await expect(
        service.register({
          email: "teste@email.com",
          password: "654321",
          nickname: "Duplicado",
        }),
      ).rejects.toThrowError(new UserError("Email já cadastrado", 409))
    })
  })

  describe("login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      await service.register({
        email: "teste@email.com",
        password: "123456",
        nickname: "Testador",
      })

      const result = await service.login("teste@email.com", "123456")

      expect(result.user.email).toBe("teste@email.com")
      expect(result.token).toBeTruthy()
    })

    it("deve lançar erro 401 se email não existir", async () => {
      await expect(
        service.login("inexistente@email.com", "123456"),
      ).rejects.toThrowError(new UserError("Email ou senha inválidos", 401))
    })

    it("deve lançar erro 401 se senha estiver errada", async () => {
      await service.register({
        email: "teste@email.com",
        password: "123456",
        nickname: "Testador",
      })

      await expect(
        service.login("teste@email.com", "senha_errada"),
      ).rejects.toThrowError(new UserError("Email ou senha inválidos", 401))
    })
  })

  describe("getProfile", () => {
    it("deve retornar perfil do usuário", async () => {
      const { user } = await service.register({
        email: "teste@email.com",
        password: "123456",
        nickname: "Testador",
      })

      const profile = await service.getProfile(user.id)

      expect(profile.id).toBe(user.id)
      expect(profile.email).toBe("teste@email.com")
      expect(profile.nickname).toBe("Testador")
    })

    it("deve lançar erro 404 se usuário não existir", async () => {
      await expect(
        service.getProfile("id-inexistente"),
      ).rejects.toThrowError(new UserError("Usuário não encontrado", 404))
    })
  })

  describe("updateProfile", () => {
    it("deve atualizar nickname do usuário", async () => {
      const { user } = await service.register({
        email: "teste@email.com",
        password: "123456",
        nickname: "Testador",
      })

      const updated = await service.updateProfile(user.id, {
        nickname: "NovoNome",
      })

      expect(updated.nickname).toBe("NovoNome")
    })

    it("deve lançar erro 404 ao atualizar usuário inexistente", async () => {
      await expect(
        service.updateProfile("id-inexistente", { nickname: "Teste" }),
      ).rejects.toThrowError(new UserError("Usuário não encontrado", 404))
    })
  })
})
