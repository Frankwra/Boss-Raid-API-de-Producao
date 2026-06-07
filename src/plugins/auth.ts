import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { verifyToken } from "../lib/jwt.js"

declare module "fastify" {
  interface FastifyRequest {
    userId: string
    userRole: string
  }
}

export async function registerAuthPlugin(app: FastifyInstance): Promise<void> {
  app.decorateRequest("userId", "")
  app.decorateRequest("userRole", "")

  app.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    const header = request.headers.authorization
    if (!header || !header.startsWith("Bearer ")) {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Token não fornecido",
      })
    }

    try {
      const token = header.slice(7)
      const payload = verifyToken(token)
      request.userId = payload.userId
      request.userRole = payload.role
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Token inválido ou expirado",
      })
    }
  })
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}
