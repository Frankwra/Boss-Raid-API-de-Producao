import type { FastifyInstance } from "fastify"
import { registerSchema, loginSchema } from "../schemas/user.schema.js"
import { UserService } from "../services/user.service.js"
import { PrismaUserRepository } from "../repositories/prisma.user.repository.js"

const userService = new UserService(new PrismaUserRepository())

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/register", async (request, reply) => {
    const data = registerSchema.parse(request.body)
    const result = await userService.register(data)
    return reply.status(201).send(result)
  })

  app.post("/auth/login", async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body)
    const result = await userService.login(email, password)
    return reply.send(result)
  })
}
