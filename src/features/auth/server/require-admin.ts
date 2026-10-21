import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth/auth'

export async function requireAdmin() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session || session.user.role !== 'admin') {
		redirect('/dashboard/login')
	}

	return session
}
