import type { FastifyInstance, FastifyRequest } from "fastify"

interface PaginationParams {
  page: number
  limit: number
}

export function parsePagination(request: FastifyRequest): PaginationParams {
  const query = request.query as { page?: string; limit?: string }
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))
  return { page, limit }
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function registerPaginationPlugin(app: FastifyInstance): Promise<void> {
  app.decorate("parsePagination", parsePagination)
  app.decorate("paginatedResponse", paginatedResponse)
}

declare module "fastify" {
  interface FastifyInstance {
    parsePagination: typeof parsePagination
    paginatedResponse: typeof paginatedResponse
  }
}
