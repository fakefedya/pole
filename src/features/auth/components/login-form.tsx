'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

export function LoginForm() {
	const router = useRouter()

	const [pending, setPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (pending) return

		const formData = new FormData(event.currentTarget)

		const email = String(formData.get('email') ?? '').trim()
		const password = String(formData.get('password') ?? '')

		setPending(true)
		setError(null)

		try {
			const result = await authClient.signIn.email({
				email,
				password,
				rememberMe: false,
			})

			if (result.error) {
				setError('Не удалось войти. Проверьте данные.')
				return
			}

			router.replace('/dashboard')
			router.refresh()
		} catch {
			setError('Ошибка соединения. Попробуйте ещё раз.')
		} finally {
			setPending(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='flex w-full max-w-sm flex-col gap-5'
		>
			<h1 className='text-3xl font-semibold'>Вход в STUDIO POLE</h1>

			<label className='flex flex-col gap-2'>
				<span>Электронная почта</span>

				<input
					name='email'
					type='email'
					autoComplete='username'
					required
					className='rounded-lg border p-3'
				/>
			</label>

			<label className='flex flex-col gap-2'>
				<span>Пароль</span>

				<input
					name='password'
					type='password'
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

			<button
				type='submit'
				disabled={pending}
				className='rounded-full bg-neutral-900 p-3 text-white disabled:opacity-50'
			>
				{pending ? 'Входим…' : 'Войти'}
			</button>
		</form>
	)
}
