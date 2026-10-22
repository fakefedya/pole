/** Один справочник ролей и прав. Без серверных импортов — пригоден для UI. */
export const ROLE = {
	ADMIN: 'admin',
	EDITOR: 'editor',
	USER: 'user',
} as const

export type Role = (typeof ROLE)[keyof typeof ROLE]

export const ROLE_LABEL: Record<Role, string> = {
	[ROLE.ADMIN]: 'Администратор',
	[ROLE.EDITOR]: 'Редактор',
	[ROLE.USER]: 'Без доступа',
}

export const PERMISSION = {
	DASHBOARD_VIEW: 'dashboard.view',
	PROJECT_READ: 'project.read',
	PROJECT_CREATE: 'project.create',
	PROJECT_UPDATE: 'project.update',
	PROJECT_DELETE: 'project.delete',
	USERS_MANAGE: 'users.manage',
} as const
export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION]

const GRANTS: Record<Role, readonly Permission[]> = {
	[ROLE.ADMIN]: Object.values(PERMISSION),
	[ROLE.EDITOR]: [
		PERMISSION.DASHBOARD_VIEW,
		PERMISSION.PROJECT_READ,
		PERMISSION.PROJECT_CREATE,
		PERMISSION.PROJECT_UPDATE,
	],
	[ROLE.USER]: [],
}

function isRole(value: string): value is Role {
	return Object.values(ROLE).some((role) => role === value)
}

/** Better Auth хранит несколько ролей строкой вида 'admin,editor'. */
export function parseRoles(value: string | null | undefined): Role[] {
	if (!value) return [ROLE.USER]
	return [
		...new Set(
			value
				.split(',')
				.map((r) => r.trim())
				.filter(isRole),
		),
	]
}

export function hasPermission(
	roleValue: string | null | undefined,
	permission: Permission,
): boolean {
	return parseRoles(roleValue).some((role) => GRANTS[role].includes(permission))
}

export function primaryRoleLabel(roleValue: string | null | undefined): string {
	const roles = parseRoles(roleValue)
	if (roles.includes(ROLE.ADMIN)) return ROLE_LABEL[ROLE.ADMIN]
	if (roles.includes(ROLE.EDITOR)) return ROLE_LABEL[ROLE.EDITOR]
	return ROLE_LABEL[ROLE.USER]
}
