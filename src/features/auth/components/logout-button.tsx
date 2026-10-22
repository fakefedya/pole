'use client'

import { useState } from 'react'

import { authClient } from '@/lib/auth/auth-client'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
	const [pending, setPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleLogout() {
		if (pending) return

		setPending(true)
		setError(null)

		try {
			const result = await authClient.signOut()

			if (result.error) {
				throw new Error('Sign-out failed')
			}

			window.location.replace('/dashboard/login')
		} catch {
			setError('Не удалось выйти. Повторите попытку.')
			setPending(false)
		}
	}

	return (
		<div className='flex flex-col items-start gap-2'>
			<Button
				type='button'
				variant='outline'
				size='sm'
				onClick={handleLogout}
				disabled={pending}
			>
				{pending ? 'Выходим…' : 'Выйти'}
			</Button>

			{error && (
				<p role='alert' className='text-xs text-red-600'>
					{error}
				</p>
			)}
		</div>
	)
}
