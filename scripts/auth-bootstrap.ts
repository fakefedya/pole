import { loadEnvConfig } from '@next/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'

import { PrismaClient } from '../src/generated/prisma/client'

loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL
const authSecret = process.env.AUTH_SECRET
const authUrl = process.env.BETTER_AUTH_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is missing')
}

if (!authSecret || authSecret.length < 32) {
	throw new Error('AUTH_SECRET is missing or too short')
}

if (!authUrl) {
	throw new Error('BETTER_AUTH_URL is missing')
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: databaseUrl,
	}),
})

export const auth = betterAuth({
	appName: 'STUDIO POLE',
	baseURL: authUrl,
	secret: authSecret,

	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),

	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
		minPasswordLength: 12,
		maxPasswordLength: 128,
	},

	plugins: [admin()],
})
