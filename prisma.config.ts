import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'prisma/config'

loadEnvConfig(process.cwd())

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error('DATABASE_URL is required. Check your .env.local file.')
}

export default defineConfig({
	schema: 'prisma',

	migrations: {
		path: 'prisma/migrations',
	},

	datasource: {
		url: databaseUrl,
	},
})
