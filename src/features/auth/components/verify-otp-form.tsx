'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

export function VerifyOtpForm() {
	const router = useRouter()

	const [code, setCode] = useState('')
	const [useBackupCode, setUseBackupCode] = useState(false)
	const [pending, setPending] = useState(false)
	const [resending, setResending] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (pending) return

		setError(null)
		setPending(true)

		try {
			const result = useBackupCode
				? await authClient.twoFactor.verifyBackupCode({
						code: code.trim(),
						trustDevice: false,
					})
				: await authClient.twoFactor.verifyOtp({
						code: code.trim(),
						trustDevice: false,
					})

			if (result.error) {
				setError('Неверный или просроченный код. Попробуйте ещё раз.')
				return
			}

			router.replace('/dashboard')
			router.refresh()
		} catch {
			setError('Ошибка соединения. Повторите попытку.')
		} finally {
			setPending(false)
		}
	}

	async function handleResend() {
		if (resending) return

		setResending(true)
		setError(null)
		setMessage(null)

		try {
			const result = await authClient.twoFactor.sendOtp({
				trustDevice: false,
			})

			if (result.error) {
				setError(
					'Не удалось отправить код. Попробуйте позже или начните вход заново.',
				)
				return
			}

			setMessage('Новый код отправлен.')
		} catch {
			setError('Ошибка отправки письма.')
		} finally {
			setResending(false)
		}
	}

	return (
		<div className='flex w-full max-w-sm flex-col gap-6'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-semibold'>Подтверждение входа</h1>

				<p className='text-sm opacity-70'>
					{useBackupCode
						? 'Введите один из сохранённых резервных кодов.'
						: 'Введите шестизначный код из письма.'}
				</p>
			</div>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<label className='flex flex-col gap-2'>
					<span>{useBackupCode ? 'Резервный код' : 'Код подтверждения'}</span>

					<input
						value={code}
						onChange={(event) => setCode(event.target.value)}
						type='text'
						inputMode={useBackupCode ? 'text' : 'numeric'}
						autoComplete={useBackupCode ? 'off' : 'one-time-code'}
						maxLength={useBackupCode ? undefined : 6}
						pattern={useBackupCode ? undefined : '[0-9]{6}'}
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
					{pending ? 'Проверяем…' : 'Подтвердить'}
				</button>
			</form>

			<div className='flex flex-col items-start gap-3'>
				{!useBackupCode && (
					<button
						type='button'
						disabled={resending}
						onClick={handleResend}
						className='text-sm underline disabled:opacity-50'
					>
						{resending ? 'Отправляем…' : 'Отправить код повторно'}
					</button>
				)}

				<button
					type='button'
					onClick={() => {
						setUseBackupCode((value) => !value)
						setCode('')
						setError(null)
						setMessage(null)
					}}
					className='text-sm underline'
				>
					{useBackupCode
						? 'Вернуться к коду из письма'
						: 'Использовать резервный код'}
				</button>

				<button
					type='button'
					onClick={() => router.replace('/dashboard/login')}
					className='text-sm opacity-60'
				>
					Вернуться ко входу
				</button>
			</div>
		</div>
	)
}
