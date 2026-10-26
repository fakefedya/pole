'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { assertUserManagementPermission } from '@/features/auth/server/access'
import { ROLE, parseRoles, type Role } from '@/lib/auth/authorization'
import { fieldErrorsFromZod } from '@/features/dashboard/lib/form-errors'
import { createUserSchema, saveUserSchema, userIdSchema } from '@/features/users/schemas/user'

export type CreateUserResult = { error: string | null; fieldErrors?: Record<string, string> }

function refresh() {
	revalidatePath('/dashboard/users')
}

async function guardTarget(userId: string, actorId: string) {
	userIdSchema.parse(userId)
	if (userId === actorId)
		throw new Error('Изменение своей учётной записи здесь запрещено.')
	const target = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, role: true, banned: true, twoFactorEnabled: true },
	})
	if (!target) throw new Error('Пользователь не найден.')
	return target
}

async function preventLastAdmin(targetId: string, currentRole: string | null) {
	if (!parseRoles(currentRole).includes(ROLE.ADMIN)) return
	const otherAdmins = await prisma.user.findMany({
		where: {
			id: { not: targetId },
			banned: { not: true },
			role: { contains: ROLE.ADMIN },
		},
		select: { role: true },
	})
	if (!otherAdmins.some((user) => parseRoles(user.role).includes(ROLE.ADMIN))) {
		throw new Error(
			'Нельзя удалить, заблокировать или понизить последнего активного администратора.',
		)
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

export async function changeUserBanAction(
	userId: string,
	shouldBan: boolean,
): Promise<void> {
	const actor = await assertUserManagementPermission()
	const target = await guardTarget(userId, actor.user.id)
	if (shouldBan) {
		await preventLastAdmin(userId, target.role)
		await auth.api.banUser({
			headers: await headers(),
			body: { userId, banReason: 'Отключён администратором' },
		})
	} else {
		await auth.api.unbanUser({ headers: await headers(), body: { userId } })
	}
	refresh()
}

/** Permanent deletion; relational Better Auth accounts/sessions cascade. */
export async function deleteUserAction(userId: string): Promise<void> {
	const actor = await assertUserManagementPermission()
	const target = await guardTarget(userId, actor.user.id)
	await preventLastAdmin(userId, target.role)
	await auth.api.removeUser({ headers: await headers(), body: { userId } })
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
	const target = await guardTarget(data.userId, actor.user.id)
	const user = await prisma.user.findUnique({
		where: { id: data.userId },
		select: { name: true, email: true, role: true, twoFactorEnabled: true },
	})
	if (!user) return { error: 'Пользователь не найден.', profileSaved: false }

	const wasAdmin = parseRoles(user.role).includes(ROLE.ADMIN)
	const willBeAdmin = data.role === ROLE.ADMIN
	const final2FA = data.twoFactorEnabled
	if (wasAdmin && !willBeAdmin) await preventLastAdmin(data.userId, target.role)

	const emailChanged = user.email !== data.email
	const roleChanged = user.role !== data.role
	const twoFactorChanged = (user.twoFactorEnabled === true) !== final2FA
	const profileChanged =
		user.name !== data.name || emailChanged || roleChanged || twoFactorChanged

	if (emailChanged) {
		const collision = await prisma.user.findUnique({
			where: { email: data.email },
			select: { id: true },
		})
		if (collision && collision.id !== data.userId) {
			return { error: 'Этот email уже используется.', profileSaved: false, fieldErrors: { email: 'Этот email уже используется.' } }
		}
	}

	try {
		if (profileChanged) {
			await prisma.$transaction(async (tx) => {
				if (user.twoFactorEnabled && !final2FA) {
					await tx.twoFactor.deleteMany({ where: { userId: data.userId } })
				}
				await tx.user.update({
					where: { id: data.userId },
					data: {
						name: data.name,
						email: data.email,
						...(emailChanged ? { emailVerified: false } : {}),
						role: data.role,
						twoFactorEnabled: final2FA,
					},
				})
				if (emailChanged || roleChanged || twoFactorChanged) {
					await tx.session.deleteMany({ where: { userId: data.userId } })
				}
			})
		}
	} catch {
		return {
			error: 'Не удалось сохранить профиль. Проверьте данные и повторите попытку.',
			profileSaved: false,
		}
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
