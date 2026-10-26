'use client'

import { useState, useTransition, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
	DashboardInputField,
	DashboardSelectField,
	DashboardCheckboxField,
} from '@/features/dashboard/components/dashboard-form-controls'
import { fieldErrorsFromZod } from '@/features/dashboard/lib/form-errors'
import { saveUserSchema } from '@/features/users/schemas/user'
import {
	saveUserChangesAction,
	changeUserBanAction,
	deleteUserAction,
} from '@/features/users/server/actions'
import {
	ROLE,
	ROLE_LABEL,
	parseRoles,
	type Role,
} from '@/lib/auth/authorization'
import type { ManagedUser } from './types'

const options = [ROLE.EDITOR, ROLE.ADMIN, ROLE.USER].map((value) => ({
	value,
	label: ROLE_LABEL[value],
}))
const primaryRole = (value: string | null | undefined): Role => {
	const all = parseRoles(value)
	return all.includes(ROLE.ADMIN)
		? ROLE.ADMIN
		: all.includes(ROLE.EDITOR)
			? ROLE.EDITOR
			: ROLE.USER
}
type Confirmation = 'ban' | 'unban' | 'delete' | 'discard' | null
type Props = {
	user: ManagedUser | null
	open: boolean
	onOpenChange: (open: boolean) => void
}
type Snapshot = {
	name: string
	email: string
	role: Role
	twoFactorEnabled: boolean
}

export function EditUserSheet({ user, open, onOpenChange }: Props) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()
	const [name, setName] = useState(() => user?.name ?? '')
	const [email, setEmail] = useState(() => user?.email ?? '')
	const [role, setRole] = useState<Role>(() => primaryRole(user?.role))
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(
		() => user?.twoFactorEnabled === true,
	)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
	const [confirmation, setConfirmation] = useState<Confirmation>(null)
	const [deleteText, setDeleteText] = useState('')
	const [deleteError, setDeleteError] = useState<string | undefined>()

	const baseline: Snapshot = snapshot ?? {
		name: user?.name ?? '',
		email: user?.email ?? '',
		role: primaryRole(user?.role),
		twoFactorEnabled: user?.twoFactorEnabled === true,
	}
	const changed =
		Boolean(user) &&
		(name.trim() !== baseline.name ||
			email.trim().toLowerCase() !== baseline.email ||
			role !== baseline.role ||
			twoFactorEnabled !== baseline.twoFactorEnabled ||
			password.length > 0 ||
			confirmPassword.length > 0)
	const updateError = (key: string) =>
		setErrors((old) => {
			if (!old[key]) return old
			const next = { ...old }
			delete next[key]
			return next
		})
	const changeOpen = (next: boolean) => {
		if (pending) return
		if (!next && changed) {
			setConfirmation('discard')
			return
		}
		onOpenChange(next)
	}

	const save = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!user || pending || !changed) return
		const input = {
			userId: user.id,
			name: name.trim(),
			email: email.trim(),
			role,
			twoFactorEnabled,
			newPassword: password,
		}
		const parsed = saveUserSchema.safeParse(input)
		const nextErrors = parsed.success ? {} : fieldErrorsFromZod(parsed.error)
		if (password !== confirmPassword)
			nextErrors.confirmPassword = 'Пароли не совпадают.'
		if (Object.keys(nextErrors).length) {
			setErrors(nextErrors)
			toast.error('Проверьте поля формы.')
			return
		}
		setErrors({})
		startTransition(async () => {
			try {
				const result = await saveUserChangesAction(input)
				if (result.error) {
					setErrors(result.fieldErrors ?? {})
					toast.error(result.error)
					if (result.profileSaved) {
						setSnapshot({
							name: input.name,
							email: input.email.toLowerCase(),
							role,
							twoFactorEnabled,
						})
						setPassword('')
						setConfirmPassword('')
						router.refresh()
					}
					return
				}
				setSnapshot({
					name: input.name,
					email: input.email.toLowerCase(),
					role,
					twoFactorEnabled,
				})
				setPassword('')
				setConfirmPassword('')
				setErrors({})
				toast.success('Изменения пользователя сохранены.')
				router.refresh()
			} catch (e) {
				toast.error(
					e instanceof Error ? e.message : 'Не удалось сохранить изменения.',
				)
			}
		})
	}

	const applyDangerousAction = () => {
		if (!user || !confirmation || pending) return
		if (confirmation === 'discard') {
			setConfirmation(null)
			onOpenChange(false)
			return
		}
		if (confirmation === 'delete' && deleteText.trim() !== user.email) {
			setDeleteError('Введите email точно, как указано в карточке.')
			return
		}
		const id = user.id
		const operation = confirmation
		startTransition(async () => {
			try {
				if (operation === 'delete') {
					await deleteUserAction(id)
					setConfirmation(null)
					setSnapshot({ name, email, role, twoFactorEnabled })
					onOpenChange(false)
					toast.success('Пользователь удалён.')
				} else {
					await changeUserBanAction(id, operation === 'ban')
					setConfirmation(null)
					toast.success(
						operation === 'ban'
							? 'Пользователь заблокирован.'
							: 'Пользователь разблокирован.',
					)
				}
				router.refresh()
			} catch (e) {
				toast.error(e instanceof Error ? e.message : 'Операция не выполнена.')
				setConfirmation(null)
			}
		})
	}

	return (
		<>
			<Sheet open={open} onOpenChange={changeOpen}>
				<SheetContent
					side='right'
					className='flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-dashboard-border bg-dashboard-background p-0 text-brand-milk shadow-2xl sm:max-w-xl'
				>
					<SheetHeader className='shrink-0 border-b border-dashboard-border px-6 py-7 pr-16'>
						<SheetTitle className='text-xl text-brand-milk'>
							Управление пользователем
						</SheetTitle>
						<SheetDescription className='text-muted-foreground'>
							Профиль, права доступа и пароль
						</SheetDescription>
					</SheetHeader>

					<div className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
						{user && (
							<div className='space-y-6'>
								<div className='flex flex-wrap gap-2'>
									<Badge
										variant='table'
										className='bg-dashboard-input text-brand-milk'
									>
										{user.banned ? 'Заблокирован' : 'Активен'}
									</Badge>
									<Badge
										variant='table'
										className='bg-dashboard-input text-brand-milk'
									>
										{twoFactorEnabled ? '2FA включена' : '2FA выключена'}
									</Badge>
								</div>
								<form
									noValidate
									id='edit-user-form'
									onSubmit={save}
									className='space-y-6'
								>
									<section className='space-y-4'>
										<h3 className='font-semibold'>Личные данные</h3>
										<DashboardInputField
											id='managed-name'
											label='Имя'
											value={name}
											onChange={(e) => {
												setName(e.target.value)
												updateError('name')
											}}
											error={errors.name}
											disabled={pending}
										/>
										<DashboardInputField
											id='managed-email'
											label='Email для входа'
											type='email'
											value={email}
											onChange={(e) => {
												setEmail(e.target.value)
												updateError('email')
											}}
											error={errors.email}
											disabled={pending}
											description='Изменение email завершает текущие сессии и сбрасывает признак подтверждения адреса.'
										/>
									</section>

									<section className='space-y-4 border-t border-dashboard-border pt-6'>
										<h3 className='font-semibold'>Доступ</h3>
										<DashboardSelectField
											id='managed-role'
											label='Роль'
											value={role}
											onValueChange={(v) => {
												setRole(v as Role)
												updateError('role')
											}}
											options={options}
											error={errors.role}
											disabled={pending}
										/>
										{parseRoles(user.role).length > 1 && (
											<p className='text-xs text-amber-400'>
												У пользователя несколько ролей; сохранение оставит одну
												выбранную.
											</p>
										)}
										<DashboardCheckboxField
											id='managed-2fa'
											label='Подтверждение входа по email (2FA)'
											checked={twoFactorEnabled}
											onCheckedChange={(v) => setTwoFactorEnabled(v)}
											disabled={pending}
											description='Доступно для любой роли. При изменении настройки действующие сессии пользователя будут завершены.'
										/>
									</section>

									<section className='space-y-4 border-t border-dashboard-border pt-6'>
										<h3 className='font-semibold'>Изменение пароля</h3>
										<DashboardInputField
											id='managed-password'
											label='Новый пароль'
											type='password'
											autoComplete='new-password'
											value={password}
											onChange={(e) => {
												setPassword(e.target.value)
												updateError('newPassword')
											}}
											error={errors.newPassword}
											disabled={pending}
											description='Оставьте пустым, чтобы сохранить прежний пароль (минимум 12 символов для нового).'
										/>
										<DashboardInputField
											id='managed-password-confirm'
											label='Повторите новый пароль'
											type='password'
											autoComplete='new-password'
											value={confirmPassword}
											onChange={(e) => {
												setConfirmPassword(e.target.value)
												updateError('confirmPassword')
											}}
											error={errors.confirmPassword}
											disabled={pending}
										/>
									</section>
								</form>
							</div>
						)}
					</div>
					<footer className='shrink-0 space-y-3 border-t border-dashboard-border bg-brand-charcoal px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
						<Button
							type='submit'
							form='edit-user-form'
							disabled={pending || !changed}
							className='h-11 w-full bg-brand-milk text-brand-charcoal hover:bg-brand-milk/90'
						>
							{pending ? 'Сохраняем…' : 'Сохранить изменения'}
						</Button>
						<div className='flex gap-2'>
							<Button
								type='button'
								variant='outline'
								disabled={pending || !user}
								onClick={() => setConfirmation(user?.banned ? 'unban' : 'ban')}
								className='flex-1 border-dashboard-input-border bg-dashboard-input text-brand-milk'
							>
								{user?.banned ? 'Разблокировать' : 'Заблокировать'}
							</Button>
							<Button
								type='button'
								variant='destructive'
								disabled={pending || !user}
								onClick={() => {
									setDeleteText('')
									setDeleteError(undefined)
									setConfirmation('delete')
								}}
								className='flex-1'
							>
								<Trash2 className='size-4' /> Удалить
							</Button>
						</div>
					</footer>
				</SheetContent>
			</Sheet>

			<AlertDialog
				open={confirmation !== null}
				onOpenChange={(next) => {
					if (!next && !pending) setConfirmation(null)
				}}
			>
				<AlertDialogContent className='border border-dashboard-input-border bg-brand-charcoal text-brand-milk'>
					<AlertDialogHeader>
						<AlertDialogTitle className='text-brand-milk'>
							Подтвердите действие
						</AlertDialogTitle>
						<AlertDialogDescription className='text-muted-foreground'>
							{confirmation === 'delete'
								? 'Учётная запись будет удалена без возможности восстановления.'
								: confirmation === 'ban'
									? 'Пользователь потеряет доступ; все его сессии завершатся.'
									: confirmation === 'unban'
										? 'Пользователь вновь получит доступ согласно своей роли.'
										: 'Несохранённые изменения будут потеряны.'}
						</AlertDialogDescription>
					</AlertDialogHeader>
					{confirmation === 'delete' && user && (
						<DashboardInputField
							id='delete-email'
							label={`Введите email: ${user.email}`}
							autoComplete='off'
							value={deleteText}
							onChange={(e) => {
								setDeleteText(e.target.value)
								setDeleteError(undefined)
							}}
							error={deleteError}
						/>
					)}
					<AlertDialogFooter>
						<AlertDialogCancel className='text-black' disabled={pending}>
							Отмена
						</AlertDialogCancel>
						<Button
							type='button'
							variant={
								confirmation === 'unban' || confirmation === 'discard'
									? 'default'
									: 'destructive'
							}
							onClick={applyDangerousAction}
							disabled={
								pending ||
								(confirmation === 'delete' && deleteText.trim() !== user?.email)
							}
						>
							{pending ? 'Выполняем…' : 'Подтвердить'}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
