import type { FastifyInstance } from "fastify"
import { createBossSchema, updateBossSchema } from "../schemas/boss.schema.js"
import { BossService } from "../services/boss.service.js"
import { PrismaBossRepository } from "../repositories/prisma.boss.repository.js"
import { parsePagination } from "../plugins/pagination.js"

const bossService = new BossService(new PrismaBossRepository())

export async function registerBossRoutes(app: FastifyInstance): Promise<void> {
  app.get("/bosses", async (request, reply) => {
    const { page, limit } = parsePagination(request)
    const result = await bossService.list(page, limit)
    return reply.send(result)
  })

  app.get("/bosses/:id", async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = await bossService.getById(id)
    return reply.send(result)
  })

  app.post("/bosses", { preHandler: [app.authenticate] }, async (request, reply) => {
    const data = createBossSchema.parse(request.body)
    const result = await bossService.create(data)
    return reply.status(201).send(result)
  })

  app.put("/bosses/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const data = updateBossSchema.parse(request.body)
    const result = await bossService.update(id, data)
    return reply.send(result)
  })

  app.delete("/bosses/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    await bossService.delete(id)
    return reply.status(204).send()
  })
}
