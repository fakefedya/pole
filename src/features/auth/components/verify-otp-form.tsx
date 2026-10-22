'use client'

import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth/auth-client'

const RESEND_COOLDOWN_SECONDS = 60

export function VerifyOtpForm() {
	const router = useRouter()

	const [code, setCode] = useState('')
	const [useBackupCode, setUseBackupCode] = useState(false)
	const [pending, setPending] = useState(false)
	const [resending, setResending] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [message, setMessage] = useState<string | null>(null)
	const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)

	const resendInFlightRef = useRef(false)

	useEffect(() => {
		if (resendCooldown <= 0) return

		const timer = window.setTimeout(() => {
			setResendCooldown((seconds) => Math.max(0, seconds - 1))
		}, 1000)

		return () => window.clearTimeout(timer)
	}, [resendCooldown])

	async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
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
		if (resendInFlightRef.current || resendCooldown > 0 || pending) {
			return
		}

		resendInFlightRef.current = true
		setResending(true)
		setError(null)
		setMessage(null)

		try {
			const result = await authClient.twoFactor.sendOtp({
				trustDevice: false,
			})

			if (result.error) {
				if (result.error.status === 429) {
					setResendCooldown(RESEND_COOLDOWN_SECONDS)
					setError('Слишком много запросов. Повторите попытку позже.')
				} else {
					setError(
						'Не удалось запросить новый код. ' +
							'Повторите вход, если срок ожидания истёк.',
					)
				}

				return
			}

			setResendCooldown(RESEND_COOLDOWN_SECONDS)
			setMessage('Новый код запрошен. Проверьте почтовый ящик.')
		} catch {
			setError('Ошибка соединения. Повторите попытку.')
		} finally {
			resendInFlightRef.current = false
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
						disabled={pending || resending || resendCooldown > 0}
						onClick={handleResend}
						className='text-sm underline disabled:cursor-not-allowed disabled:opacity-50'
					>
						{resending
							? 'Отправляем…'
							: resendCooldown > 0
								? `Отправить повторно через ${resendCooldown} сек.`
								: 'Отправить код повторно'}
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
