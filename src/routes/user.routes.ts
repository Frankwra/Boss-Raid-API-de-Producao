import type { FastifyInstance } from "fastify"
import { updateUserSchema } from "../schemas/user.schema.js"
import { UserService } from "../services/user.service.js"
import { PrismaUserRepository } from "../repositories/prisma.user.repository.js"

const userService = new UserService(new PrismaUserRepository())

export async function registerUserRoutes(app: FastifyInstance): Promise<void> {
  app.get("/users/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = await userService.getProfile(id)
    return reply.send(result)
  })

  app.put("/users/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const data = updateUserSchema.parse(request.body)
    const result = await userService.updateProfile(id, data)
    return reply.send(result)
  })
}
