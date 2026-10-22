import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'
import {
	hasPermission,
	PERMISSION,
	type Permission,
} from '@/lib/auth/authorization'

async function currentSession() {
	return auth.api.getSession({ headers: await headers() })
}

/** Для страниц. Security-страница доступна и до подключения 2FA. */
export async function requireDashboardSession() {
	const session = await currentSession()
	if (!session) redirect('/dashboard/login')
	if (session.user.banned) redirect('/dashboard/forbidden')
	if (session.user.banned) redirect('/dashboard/forbidden')
	if (!hasPermission(session.user.role, PERMISSION.DASHBOARD_VIEW)) {
		redirect('/dashboard/forbidden')
	}
	return session
}

/** Для защищённых страниц после настройки 2FA. */
export async function requireDashboardReady() {
	const session = await requireDashboardSession()
	if (session.user.twoFactorEnabled !== true) redirect('/dashboard/security')
	return session
}

/** Для страниц, не для мутаций. */
export async function requirePagePermission(permission: Permission) {
	const session = await requireDashboardReady()
	if (!hasPermission(session.user.role, permission))
		redirect('/dashboard/forbidden')
	return session
}

/** Для Server Actions: ВСЕГДА проверять отдельно от layout. */
export async function assertMutationPermission(permission: Permission) {
	const session = await currentSession()
	if (
		!session ||
		session.user.banned ||
		session.user.twoFactorEnabled !== true ||
		!hasPermission(session.user.role, permission)
	) {
		throw new Error('FORBIDDEN')
	}
	return session
}
