import { ROLE_LABEL, parseRoles } from '@/lib/auth/authorization'
import type { ManagedUser } from './types'

export const USERS_PAGE_SIZE = 10

export function userSearchText(user: ManagedUser): string {
	const roles = parseRoles(user.role)
		.map((role) => ROLE_LABEL[role])
		.join(' ')
	return `${user.name} ${user.email} ${roles}`
}
