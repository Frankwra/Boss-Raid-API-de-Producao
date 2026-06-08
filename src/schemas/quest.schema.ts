import { z } from "zod"

export const createQuestSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(100),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(500),
  difficulty: z.number().int().min(1).max(5),
  xpReward: z.number().int().min(1, "Recompensa deve ser positiva"),
})

export const updateQuestSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  xpReward: z.number().int().min(1).optional(),
})

export const completeQuestSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
})
