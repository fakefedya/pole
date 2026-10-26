'use client'

import { useState } from 'react'

import { authClient } from '@/lib/auth/auth-client'
import { Button } from '@/components/ui/button'
import { Loader, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

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
				className={cn(
					'flex items-center h-13 w-13 p-4 rounded-full bg-brand-charcoal text-brand-milk cursor-pointer ',
					'hover:bg-brand-milk/10 transition-colors duration-300',
				)}
				onClick={handleLogout}
				disabled={pending}
			>
				{pending ? <Loader size={20} /> : <LogOut size={20} />}
			</Button>

			{error && (
				<p role='alert' className='text-xs text-red-600'>
					{error}
				</p>
			)}
		</div>
	)
}
