'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { authClient } from '@/lib/auth/auth-client'

type Props = {
	initiallyEnabled: boolean
}

export function TwoFactorSetup({ initiallyEnabled }: Props) {
	const router = useRouter()

	const [enabled, setEnabled] = useState(initiallyEnabled)
	const [password, setPassword] = useState('')
	const [pending, setPending] = useState(false)
	const [backupCodes, setBackupCodes] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (pending || !password) return

		setPending(true)
		setError(null)
		setMessage(null)

		try {
			if (!enabled) {
				const enableResult = await authClient.twoFactor.enable({
					password,
					method: 'otp',
				})

				if (enableResult.error) {
					setError('Не удалось включить 2FA. Проверьте пароль.')
					return
				}

				setEnabled(true)
			}

			const backupResult = await authClient.twoFactor.generateBackupCodes({
				password,
			})

			if (backupResult.error || !backupResult.data) {
				setError(
					'2FA может быть уже включена, но резервные коды не получены. Не выходите из аккаунта, повторите попытку.',
				)
				return
			}

			setBackupCodes(backupResult.data.backupCodes)
			setPassword('')

			setMessage(
				'Двухфакторная авторизация включена. Сохраните резервные коды.',
			)

			router.refresh()
		} catch {
			setError('Произошла ошибка. Повторите попытку.')
		} finally {
			setPending(false)
		}
	}

	return (
		<div className='flex flex-col gap-6'>
			<p className='text-sm opacity-70'>
				{enabled
					? 'Двухфакторная авторизация включена.'
					: 'Подключите подтверждение входа кодом из письма.'}
			</p>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<label className='flex flex-col gap-2'>
					<span>Текущий пароль администратора</span>

					<input
						type='password'
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						autoComplete='current-password'
						required
						className='rounded-lg border p-3'
					/>
				</label>

				{error && (
					<p role='alert' className='text-sm text-red-600'>
						{error}
					</p>
				)}

				{message && (
					<p role='status' className='text-sm'>
						{message}
					</p>
				)}

				<button
					type='submit'
					disabled={pending}
					className='rounded-full bg-neutral-900 p-3 text-white disabled:opacity-50'
				>
					{pending
						? 'Сохраняем…'
						: enabled
							? 'Создать новые резервные коды'
							: 'Включить 2FA'}
				</button>
			</form>

			{backupCodes.length > 0 && (
				<section className='rounded-xl border p-5'>
					<h2 className='text-lg font-semibold'>Резервные коды</h2>

					<p className='my-3 text-sm opacity-70'>
						Сохраните их в менеджере паролей. Каждый код можно использовать
						только один раз.
					</p>

					<div className='grid grid-cols-2 gap-3'>
						{backupCodes.map((code) => (
							<code
								key={code}
								className='rounded bg-neutral-100 p-2 text-neutral-900'
							>
								{code}
							</code>
						))}
					</div>
				</section>
			)}

			<Link href='/dashboard' className='text-sm underline'>
				Вернуться в Dashboard
			</Link>
		</div>
	)
}
