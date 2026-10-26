import { z } from 'zod'

/** One policy for create-user and admin password reset; Better Auth hashes passwords. */
export const PASSWORD_MIN_LENGTH = 12
export const PASSWORD_MAX_LENGTH = 128

export const passwordSchema = z
	.string()
	.min(
		PASSWORD_MIN_LENGTH,
		`Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов.`,
	)
	.max(
		PASSWORD_MAX_LENGTH,
		`Пароль должен содержать не более ${PASSWORD_MAX_LENGTH} символов.`,
	)
	.refine(
		(value) => !value.includes('\u0000'),
		'Пароль содержит недопустимые символы.',
	)

export const validatePasswordConfirmation = (
	password: string,
	confirm: string,
) => {
	const result = passwordSchema.safeParse(password)
	if (!result.success)
		return result.error.issues[0]?.message ?? 'Недопустимый пароль.'
	if (password !== confirm) return 'Пароли не совпадают.'
	return null
}
