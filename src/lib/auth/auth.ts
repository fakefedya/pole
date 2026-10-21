import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'

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
		},
	},

	plugins: [admin()],
})
