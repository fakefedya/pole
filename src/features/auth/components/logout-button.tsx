'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

export function LogoutButton() {
	const router = useRouter()
	const [pending, setPending] = useState(false)

	async function handleLogout() {
		if (pending) return

		setPending(true)

		try {
			const { error } = await authClient.signOut()

			if (error) {
				throw new Error('Sign-out failed')
			}

			router.replace('/dashboard/login')
			router.refresh()
		} catch {
			setPending(false)
			window.alert('Не удалось выйти. Повторите попытку.')
		}
	}

	return (
		<button
			type='button'
			onClick={handleLogout}
			disabled={pending}
			className='rounded-full border px-5 py-2 disabled:opacity-50'
		>
			{pending ? 'Выходим…' : 'Выйти'}
		</button>
	)
}
