import { VerifyOtpForm } from '@/features/auth/components/verify-otp-form'

export function VerifyPage() {
	return (
		<main className='flex min-h-dvh items-center justify-center bg-background px-6 text-foreground'>
			<VerifyOtpForm />
		</main>
	)
}

export { VerifyPage as default }