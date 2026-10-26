'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/prisma'
import { assertUserManagementPermission } from '@/features/auth/server/access'
import { ROLE, parseRoles, type Role } from '@/lib/auth/authorization'
import { passwordSchema } from '@/features/auth/schemas/password'

const userIdSchema = z.string().min(1).max(256)
const roleSchema = z.enum([ROLE.ADMIN, ROLE.EDITOR, ROLE.USER])
const createSchema = z.object({
	name: z.string().trim().min(2).max(100),
	email: z
		.email()
		.max(254)
		.transform((value) => value.toLowerCase()),
	role: roleSchema,
	password: passwordSchema,
})

export type CreateUserResult = { error: string | null }

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
	const parsed = createSchema.safeParse(input)
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? 'Некорректные данные.' }
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
const saveUserSchema = z.object({
	userId: userIdSchema,
	name: z.string().trim().min(2).max(100),
	email: z
		.email()
		.max(254)
		.transform((value) => value.trim().toLowerCase()),
	role: roleSchema,
	twoFactorEnabled: z.boolean(),
	newPassword: z.union([z.literal(''), passwordSchema]),
})

export type SaveUserResult = { error: string | null; profileSaved: boolean }

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
			error: parsed.error.issues[0]?.message ?? 'Неверные данные.',
			profileSaved: false,
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
	const final2FA = willBeAdmin && (wasAdmin ? data.twoFactorEnabled : false)
	if (!wasAdmin && data.twoFactorEnabled) {
		return {
			error: 'Включить 2FA можно после назначения роли администратора.',
			profileSaved: false,
		}
	}
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
			return { error: 'Этот email уже используется.', profileSaved: false }
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
			error: 'Не удалось сохранить данные. Проверьте уникальность email.',
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
				error:
					'Профиль сохранён, но пароль изменить не удалось. Повторите сохранение пароля.',
				profileSaved: true,
			}
		}
	}
	refresh()
	return { error: null, profileSaved: true }
}
