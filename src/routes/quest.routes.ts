import type { FastifyInstance } from "fastify"
import { createQuestSchema, updateQuestSchema, completeQuestSchema } from "../schemas/quest.schema.js"
import { QuestService } from "../services/quest.service.js"
import { PrismaQuestRepository } from "../repositories/prisma.quest.repository.js"
import { PrismaUserRepository } from "../repositories/prisma.user.repository.js"
import { parsePagination } from "../plugins/pagination.js"

const questService = new QuestService(new PrismaQuestRepository(), new PrismaUserRepository())

export async function registerQuestRoutes(app: FastifyInstance): Promise<void> {
  app.get("/quests", async (request, reply) => {
    const { page, limit } = parsePagination(request)
    const result = await questService.list(page, limit)
    return reply.send(result)
  })

  app.get("/quests/:id", async (request, reply) => {
    const { id } = request.params as { id: string }
    const result = await questService.getById(id)
    return reply.send(result)
  })

  app.post("/quests", { preHandler: [app.authenticate] }, async (request, reply) => {
    const data = createQuestSchema.parse(request.body)
    const result = await questService.create(data)
    return reply.status(201).send(result)
  })

  app.put("/quests/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const data = updateQuestSchema.parse(request.body)
    const result = await questService.update(id, data)
    return reply.send(result)
  })

  app.delete("/quests/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    await questService.delete(id)
    return reply.status(204).send()
  })

  app.post("/quests/:id/complete", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { userId } = completeQuestSchema.parse(request.body)
    const result = await questService.complete(id, userId)
    return reply.send(result)
  })

  app.get("/quests/completed", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.query as { userId: string }
    if (!userId) return reply.status(400).send({ message: "userId é obrigatório" })
    const result = await questService.getCompletedQuestIds(userId)
    return reply.send({ data: result })
  })
}
