export type ManagedUser = {
	id: string
	name: string
	email: string
	role: string | null
	banned: boolean | null
	twoFactorEnabled: boolean | null
	createdAt: string
}
