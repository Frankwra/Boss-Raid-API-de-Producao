import type { FastifyInstance } from "fastify"
import { createRaidSchema, joinRaidSchema, attackRaidSchema } from "../schemas/raid.schema.js"
import { RaidService } from "../services/raid.service.js"
import { PrismaRaidRepository } from "../repositories/prisma.raid.repository.js"
import { PrismaUserRepository } from "../repositories/prisma.user.repository.js"
import { PrismaBossRepository } from "../repositories/prisma.boss.repository.js"

const raidService = new RaidService(
  new PrismaRaidRepository(),
  new PrismaUserRepository(),
  new PrismaBossRepository(),
)

export async function registerRaidRoutes(app: FastifyInstance): Promise<void> {
  app.post("/raids", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { bossId } = createRaidSchema.parse(request.body)
    const result = await raidService.create(request.userId, bossId)
    return reply.status(201).send(result)
  })

  app.post("/raids/:id/join", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { userId } = joinRaidSchema.parse(request.body)
    const result = await raidService.join(id, userId)
    return reply.send(result)
  })

  app.post("/raids/:id/attack", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { userId } = attackRaidSchema.parse(request.body)
    const result = await raidService.attack(id, userId)
    return reply.send(result)
  })

  app.get("/raids/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = await raidService.getStatus(id)
    return reply.send(result)
  })
}
