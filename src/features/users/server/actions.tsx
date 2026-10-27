'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth/auth'
import { Prisma } from '@/generated/prisma/client'
import { serializable, lockAdminMutations } from '@/lib/db/transaction-guards'
import { prisma } from '@/lib/db/prisma'
import { assertUserManagementPermission } from '@/features/auth/server/access'
import { ROLE, parseRoles, type Role } from '@/lib/auth/authorization'
import { fieldErrorsFromZod } from '@/features/dashboard/lib/form-errors'
import { createUserSchema, saveUserSchema, userIdSchema } from '@/features/users/schemas/user'

export type CreateUserResult = { error: string | null; fieldErrors?: Record<string, string> }

function refresh() {
	revalidatePath('/dashboard/users')
}

/** Must be called while holding lockAdminMutations() inside the same transaction. */
async function requireAnotherActiveAdmin(tx: Prisma.TransactionClient, targetId: string, currentRole: string | null) {
  if (!parseRoles(currentRole).includes(ROLE.ADMIN)) return
  const others = await tx.user.findMany({
    where: { id: { not: targetId }, banned: { not: true }, role: { contains: ROLE.ADMIN } },
    select: { role: true },
  })
  if (!others.some((user) => parseRoles(user.role).includes(ROLE.ADMIN))) {
    throw new Error('Нельзя удалить, заблокировать или понизить последнего активного администратора.')
  }
}

/** Better Auth hashes this password via its credential-account provider. */
export async function createUserAction(input: {
	name: string
	email: string
	role: string
	password: string
}): Promise<CreateUserResult> {
	await assertUserManagementPermission()
	const parsed = createUserSchema.safeParse(input)
	if (!parsed.success) return { error: 'Проверьте поля формы.', fieldErrors: fieldErrorsFromZod(parsed.error) }
	const existingEmail = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } })
	if (existingEmail) return { error: 'Этот email уже используется.', fieldErrors: { email: 'Этот email уже зарегистрирован.' } }
	try {
		await auth.api.createUser({ headers: await headers(), body: parsed.data })
		refresh()
		return { error: null }
	} catch {
		return { error: 'Создание не удалось. Возможно, email уже используется.' }
	}
}

export async function changeUserBanAction(userId: string, shouldBan: boolean): Promise<void> {
  const actor = await assertUserManagementPermission()
  userIdSchema.parse(userId)
  if (userId === actor.user.id) throw new Error('Нельзя заблокировать свой аккаунт.')
  await serializable(async (tx) => {
    await lockAdminMutations(tx)
    const target = await tx.user.findUnique({ where: { id: userId }, select: { role: true } })
    if (!target) throw new Error('Пользователь не найден.')
    if (shouldBan) await requireAnotherActiveAdmin(tx, userId, target.role)
    await tx.user.update({ where: { id: userId }, data: {
      banned: shouldBan, banReason: shouldBan ? 'Отключён администратором' : null,
      banExpires: null,
    } })
    await tx.session.deleteMany({ where: { userId } })
  })
  refresh()
}

/** Transactional deletion; Better Auth relations cascade via foreign keys. */
export async function deleteUserAction(userId: string): Promise<void> {
  const actor = await assertUserManagementPermission()
  userIdSchema.parse(userId)
  if (userId === actor.user.id) throw new Error('Нельзя удалить собственную запись.')
  await serializable(async (tx) => {
    await lockAdminMutations(tx)
    const target = await tx.user.findUnique({ where: { id: userId }, select: { role: true } })
    if (!target) throw new Error('Пользователь не найден.')
    await requireAnotherActiveAdmin(tx, userId, target.role)
    await tx.user.delete({ where: { id: userId } })
  })
  refresh()
}

/** Single UI save: profile, role and email-OTP setting share a DB transaction.
 * Password hashing stays in Better Auth. Since its password API runs separately,
 * errors report partial completion rather than claiming a transaction across both.
 */
export type SaveUserResult = { error: string | null; profileSaved: boolean; fieldErrors?: Record<string, string> }

export async function saveUserChangesAction(input: {
	userId: string
	name: string
	email: string
	role: Role
	twoFactorEnabled: boolean
	newPassword: string
}): Promise<SaveUserResult> {
	const actor = await assertUserManagementPermission()
	const parsed = saveUserSchema.safeParse(input)
	if (!parsed.success) {
		return {
			error: 'Проверьте поля формы.',
			profileSaved: false,
            fieldErrors: fieldErrorsFromZod(parsed.error),
		}
	}

	const data = parsed.data
	if (data.userId === actor.user.id) return { error: 'Нельзя редактировать свою учётную запись.', profileSaved: false }
  try {
    await serializable(async (tx) => {
      await lockAdminMutations(tx)
      const user = await tx.user.findUnique({
        where: { id: data.userId },
        select: { name: true, email: true, role: true, twoFactorEnabled: true },
      })
      if (!user) throw new Error('Пользователь не найден.')
      const wasAdmin = parseRoles(user.role).includes(ROLE.ADMIN)
      if (wasAdmin && data.role !== ROLE.ADMIN) {
        await requireAnotherActiveAdmin(tx, data.userId, user.role)
      }
      const emailChanged = user.email !== data.email
      const roleChanged = user.role !== data.role
      const twoFactorChanged = (user.twoFactorEnabled === true) !== data.twoFactorEnabled
      if (emailChanged) {
        const duplicate = await tx.user.findUnique({ where: { email: data.email }, select: { id: true } })
        if (duplicate && duplicate.id !== data.userId) throw new Error('EMAIL_TAKEN')
      }
      if (user.twoFactorEnabled && !data.twoFactorEnabled) {
        await tx.twoFactor.deleteMany({ where: { userId: data.userId } })
      }
      await tx.user.update({ where: { id: data.userId }, data: {
        name: data.name, email: data.email,
        ...(emailChanged ? { emailVerified: false } : {}),
        role: data.role, twoFactorEnabled: data.twoFactorEnabled,
      } })
      if (emailChanged || roleChanged || twoFactorChanged) {
        await tx.session.deleteMany({ where: { userId: data.userId } })
      }
    })
  } catch (error) {
    if ((error instanceof Error && error.message === 'EMAIL_TAKEN') ||
      (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) {
      return { error: 'Email уже используется.', profileSaved: false, fieldErrors: { email: 'Email уже используется.' } }
    }
    return { error: error instanceof Error ? error.message : 'Не удалось сохранить профиль.', profileSaved: false }
  }

	if (data.newPassword) {
		try {
			await auth.api.setUserPassword({
				headers: await headers(),
				body: { userId: data.userId, newPassword: data.newPassword },
			})
			await prisma.session.deleteMany({ where: { userId: data.userId } })
		} catch {
			refresh()
			return {
				error: 'Профиль сохранён, но пароль не изменён. Повторите попытку.',
                profileSaved: true,
                fieldErrors: { newPassword: 'Не удалось изменить пароль.' },
			}
		}
	}
	refresh()
	return { error: null, profileSaved: true }
}
