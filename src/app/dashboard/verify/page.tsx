import { VerifyOtpForm } from '@/features/auth/components/verify-otp-form'

export function VerifyPage() {
	return (
		<main className='flex min-h-dvh items-center justify-center px-6'>
			<VerifyOtpForm />
		</main>
	)
}

export { VerifyPage as default }
