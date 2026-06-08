import { z } from "zod"

export const createBossSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  hp: z.number().int().min(1, "HP deve ser positivo"),
  damage: z.number().int().min(1, "Dano deve ser positivo"),
  xpReward: z.number().int().min(1, "Recompensa deve ser positiva"),
  levelRequired: z.number().int().min(1).default(1),
})

export const updateBossSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  hp: z.number().int().min(1).optional(),
  damage: z.number().int().min(1).optional(),
  xpReward: z.number().int().min(1).optional(),
  levelRequired: z.number().int().min(1).optional(),
})
