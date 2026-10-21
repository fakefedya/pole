import { LoginForm } from '@/features/auth/components/login-form'

export function AdminLoginPage() {
	return (
		<main className='flex min-h-dvh items-center justify-center px-6'>
			<LoginForm />
		</main>
	)
}

export { AdminLoginPage as default }
