import 'server-only'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/prisma'
import {
	hasPermission,
	PERMISSION,
	type Permission,
} from '@/lib/auth/authorization'

async function accessContext() {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) return null
	// Read the current DB role/policy, not just the session snapshot.
	const record = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: {
			role: true,
			banned: true,
			twoFactorEnabled: true,
		},
	})
	if (!record) return null
	return {
		session: { ...session, user: { ...session.user, ...record } },
		record,
	}
}

/** Open the workspace for all roles with dashboard.view. */
export async function requireDashboardSession() {
	const context = await accessContext()
	if (!context) redirect('/dashboard/login')
	if (
		context.record.banned ||
		!hasPermission(context.record.role, PERMISSION.DASHBOARD_VIEW)
	) {
		redirect('/dashboard/forbidden')
	}
	return context.session
}

/** Retained for pages that already import this guard. Authentication + role only. */
export async function requireDashboardReady() {
	return requireDashboardSession()
}

export async function requirePagePermission(permission: Permission) {
	const session = await requireDashboardReady()
	if (!hasPermission(session.user.role, permission))
		redirect('/dashboard/forbidden')
	return session
}

/** Run in every mutating Server Action. */
export async function assertMutationPermission(permission: Permission) {
	const context = await accessContext()
	if (
		!context ||
		context.record.banned ||
		!hasPermission(context.record.role, permission)
	) {
		throw new Error('FORBIDDEN')
	}
	return context.session
}

/** Authorization for any administrator, regardless of optional email-2FA setting. */
export async function assertUserManagementPermission() {
	return assertMutationPermission(PERMISSION.USERS_MANAGE)
}
