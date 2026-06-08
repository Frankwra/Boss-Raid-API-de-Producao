import Fastify from "fastify"
import "dotenv/config"
import { ZodError } from "zod"
import { registerPaginationPlugin } from "./plugins/pagination.js"
import { registerAuthPlugin } from "./plugins/auth.js"
import { registerAuthRoutes } from "./routes/auth.routes.js"
import { registerUserRoutes } from "./routes/user.routes.js"
import { registerQuestRoutes } from "./routes/quest.routes.js"
import { registerBossRoutes } from "./routes/boss.routes.js"
import { registerRaidRoutes } from "./routes/raid.routes.js"

const app = Fastify({ logger: true })

app.get("/", async () => {
  return {
    name: "Boss Raid API",
    version: "1.0.0",
    status: "running",
    docs: "https://github.com/Frankwra/Boss-Raid-API-de-Producao",
  }
})

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Dados inválidos",
      details: error.errors.map((e) => ({
        campo: e.path.join("."),
        mensagem: e.message,
      })),
    })
  }

  if (error.statusCode && error.statusCode < 500) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    })
  }

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Ocorreu um erro inesperado",
  })
})

await registerPaginationPlugin(app)
await registerAuthPlugin(app)
await registerAuthRoutes(app)
await registerUserRoutes(app)
await registerQuestRoutes(app)
await registerBossRoutes(app)
await registerRaidRoutes(app)

const start = async () => {
  try {
    const port = Number(process.env.PORT ?? 3000)
    await app.listen({ port, host: "0.0.0.0" })
    app.log.info(`Server running on port ${port}`)
  } catch (err) {
    app.log.fatal(err)
    process.exit(1)
  }
}

start()

export default app
