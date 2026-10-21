import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, twoFactor } from 'better-auth/plugins'
import { sendSecurityCode } from '@/lib/email/send-security-code'

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
			'/two-factor/verify-backup-code': {
				window: 60,
				max: 5,
			},
		},
	},

	plugins: [
		admin(),

		twoFactor({
			issuer: 'STUDIO POLE',

			otpOptions: {
				period: 5,

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
