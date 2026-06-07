import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  nickname: z.string().min(2, "Nickname deve ter no mínimo 2 caracteres").max(30),
})

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export const updateUserSchema = z.object({
  nickname: z.string().min(2).max(30).optional(),
  avatar: z.string().url("Avatar deve ser uma URL válida").optional(),
})
