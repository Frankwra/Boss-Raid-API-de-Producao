import Fastify from "fastify"
import "dotenv/config"
import { registerPaginationPlugin } from "./plugins/pagination.js"
import { registerAuthPlugin } from "./plugins/auth.js"
import { registerAuthRoutes } from "./routes/auth.routes.js"
import { registerUserRoutes } from "./routes/user.routes.js"

const app = Fastify({ logger: true })

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error)

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
