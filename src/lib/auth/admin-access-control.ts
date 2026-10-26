import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements } from 'better-auth/plugins/admin/access'
import { ROLE } from '@/lib/auth/authorization'

// Управление аккаунтами Better Auth и доступ к бизнес-объектам разделены.
// Администратор может менять пароли и удалять учётные записи; impersonate и set-email не выдаём.
export const authAccessControl = createAccessControl(defaultStatements)
export const authRoles = {
	[ROLE.ADMIN]: authAccessControl.newRole({
		user: [
			'create',
			'list',
			'set-role',
			'get',
			'ban',
			'set-password',
			'delete',
		],
		session: ['list', 'revoke'],
	}),
	[ROLE.EDITOR]: authAccessControl.newRole({}),
	[ROLE.USER]: authAccessControl.newRole({}),
}
