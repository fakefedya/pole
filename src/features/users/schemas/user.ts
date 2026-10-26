import { z } from 'zod'
import { ROLE } from '@/lib/auth/authorization'
import { passwordSchema } from '@/features/auth/schemas/password'

export const userIdSchema = z.string().min(1).max(256)
export const userRoleSchema = z.enum([ROLE.ADMIN, ROLE.EDITOR, ROLE.USER])
export const userNameSchema = z.string().trim().min(2, 'Укажите имя (минимум 2 символа).').max(100, 'Не более 100 символов.')
export const userEmailSchema = z.string().trim().email('Введите корректный email.').max(254, 'Email слишком длинный.').transform(value => value.toLowerCase())

export const createUserSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  role: userRoleSchema,
  password: passwordSchema,
})

export const saveUserSchema = z.object({
  userId: userIdSchema,
  name: userNameSchema,
  email: userEmailSchema,
  role: userRoleSchema,
  twoFactorEnabled: z.boolean(),
  newPassword: z.union([z.literal(''), passwordSchema]),
})
