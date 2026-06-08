import { z } from "zod"

export const createRaidSchema = z.object({
  bossId: z.string().uuid("ID do boss inválido"),
})

export const joinRaidSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
})

export const attackRaidSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
})
