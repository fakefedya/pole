import { createAuthClient } from 'better-auth/react'
import { adminClient, twoFactorClient } from 'better-auth/client/plugins'
import { authAccessControl, authRoles } from './admin-access-control'

export const authClient = createAuthClient({
	plugins: [
		twoFactorClient(),
		adminClient({ ac: authAccessControl, roles: authRoles }),
	],
})
