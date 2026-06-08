import { z } from "zod"

export const createRaidSchema = z.object({
  bossId: z.string().min(1, "ID do boss é obrigatório"),
})

export const joinRaidSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
})

export const attackRaidSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
})
