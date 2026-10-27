import { betterAuth } from 'better-auth'
import { createAuthMiddleware, APIError } from 'better-auth/api'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, twoFactor } from 'better-auth/plugins'
import { sendSecurityCode } from '@/lib/email/send-security-code'
import {
	ROLE,
	PERMISSION,
	hasPermission,
	parseRoles,
} from '@/lib/auth/authorization'
import { authAccessControl, authRoles } from '@/lib/auth/admin-access-control'
import { passwordSchema } from '@/features/auth/schemas/password'

import { env } from '@/env'
import { prisma } from '@/lib/db/prisma'

export const auth = betterAuth({
	appName: 'STUDIO POLE',

	baseURL: env.BETTER_AUTH_URL,
	secret: env.AUTH_SECRET,

	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),

	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
		minPasswordLength: 12,
		maxPasswordLength: 128,
	},

	session: {
		expiresIn: 60 * 60 * 12,
		updateAge: 60 * 60,
	},

	rateLimit: {
		enabled: true,
		storage: 'database',
		window: 60,
		max: 100,
		customRules: {
			'/sign-in/email': {
				window: 60,
				max: 5,
			},
			'/two-factor/send-otp': {
				window: 60,
				max: 3,
			},
			'/two-factor/verify-otp': {
				window: 60,
				max: 5,
			},
		},
	},

	// An independent guard for the public Better Auth admin API.
	// Server Action checks alone do not protect /api/auth/admin/* endpoints.
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			// Disable self-service 2FA enrollment and every backup-code / TOTP endpoint.
			// Email-OTP for sign-in remains available.
			if (
				ctx.path.startsWith('/two-factor/') &&
				ctx.path !== '/two-factor/send-otp' &&
				ctx.path !== '/two-factor/verify-otp'
			) {
				throw new APIError('FORBIDDEN', {
					message: '2FA is managed by administrators',
				})
			}
			// These mutations are only permitted via audited Server Actions with row/actor locks.
			if (
				[
					'/admin/ban-user',
					'/admin/unban-user',
					'/admin/remove-user',
					'/admin/set-role',
					'/admin/update-user',
				].includes(ctx.path)
			) {
				throw new APIError('FORBIDDEN', {
					message: 'Use dashboard user management',
				})
			}
			if (!ctx.path.startsWith('/admin/')) return
			if (!ctx.headers) throw new APIError('UNAUTHORIZED')
			const session = await auth.api.getSession({ headers: ctx.headers })
			if (!session) throw new APIError('UNAUTHORIZED')
			const record = await prisma.user.findUnique({
				where: { id: session.user.id },
				select: { role: true, banned: true },
			})
			if (
				!record ||
				record.banned ||
				!hasPermission(record.role, PERMISSION.USERS_MANAGE)
			) {
				throw new APIError('FORBIDDEN', {
					message: 'Administrator access required',
				})
			}
			const body = ctx.body as
				| {
						userId?: string
						role?: string | string[]
						password?: string
						newPassword?: string
				  }
				| undefined
			if (
				ctx.path === '/admin/create-user' ||
				ctx.path === '/admin/set-user-password'
			) {
				const value =
					ctx.path === '/admin/create-user' ? body?.password : body?.newPassword
				if (
					typeof value !== 'string' ||
					!passwordSchema.safeParse(value).success
				) {
					throw new APIError('BAD_REQUEST', {
						message: 'Password must be 12–128 characters',
					})
				}
			}
			const userId = body?.userId
			if (
				typeof userId === 'string' &&
				(ctx.path === '/admin/set-role' ||
					ctx.path === '/admin/ban-user' ||
					ctx.path === '/admin/remove-user' ||
					ctx.path === '/admin/set-user-password')
			) {
				if (userId === session.user.id) {
					throw new APIError('FORBIDDEN', {
						message: 'Cannot modify own access',
					})
				}
				const target = await prisma.user.findUnique({
					where: { id: userId },
					select: { role: true },
				})
				if (target && parseRoles(target.role).includes(ROLE.ADMIN)) {
					const demoting =
						ctx.path === '/admin/ban-user' ||
						ctx.path === '/admin/remove-user' ||
						(ctx.path === '/admin/set-role' &&
							!parseRoles(
								Array.isArray(body?.role) ? body.role.join(',') : body?.role,
							).includes(ROLE.ADMIN))
					if (demoting) {
						const others = await prisma.user.findMany({
							where: {
								id: { not: userId },
								banned: { not: true },
								role: { contains: ROLE.ADMIN },
							},
							select: { role: true },
						})
						if (!others.some((u) => parseRoles(u.role).includes(ROLE.ADMIN))) {
							throw new APIError('FORBIDDEN', {
								message: 'Cannot remove the last active admin',
							})
						}
					}
				}
			}
		}),
	},

	plugins: [
		admin({ defaultRole: ROLE.USER, ac: authAccessControl, roles: authRoles }),

		twoFactor({
			issuer: 'STUDIO POLE',

			otpOptions: {
				period: 5,
				allowedAttempts: 5,
				storeOTP: 'hashed',

				async sendOTP({ user, otp }) {
					await sendSecurityCode({
						to: user.email,
						code: otp,
					})
				},
			},

			accountLockout: {
				enabled: true,
				maxFailedAttempts: 5,
				durationSeconds: 15 * 60,
			},
		}),
	],
})
