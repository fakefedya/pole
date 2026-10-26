'use client'

import { useEffect, useState, useTransition, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  saveUserChangesAction, changeUserBanAction, deleteUserAction,
} from '@/features/users/server/actions'
import {
  PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, validatePasswordConfirmation,
} from '@/features/auth/schemas/password'
import { ROLE, ROLE_LABEL, parseRoles, type Role } from '@/lib/auth/authorization'
import type { ManagedUser } from './types'

type Confirmation = 'ban' | 'unban' | 'delete' | null
const primaryEditRole = (value: string | null | undefined): Role => {
  const roles = parseRoles(value)
  return roles.includes(ROLE.ADMIN) ? ROLE.ADMIN : roles.includes(ROLE.EDITOR) ? ROLE.EDITOR : ROLE.USER
}
type Props = { user: ManagedUser | null; open: boolean; onOpenChange: (open: boolean) => void }
const roles = [ROLE.EDITOR, ROLE.ADMIN, ROLE.USER] as const

export function EditUserSheet({ user, open, onOpenChange }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>(ROLE.USER)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmation, setConfirmation] = useState<Confirmation>(null)
  const [deleteText, setDeleteText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [savedSnapshot, setSavedSnapshot] = useState<{ name: string; email: string; role: string; twoFactorEnabled: boolean } | null>(null)

  // The Sheet stays mounted during the closing transition. Draft resets on open or server refresh.
  useEffect(() => {
    if (!open || !user) return
    setName(user.name)
    setEmail(user.email)
    setRole(primaryEditRole(user.role))
    setTwoFactorEnabled(user.twoFactorEnabled === true)
    setPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(null)
    setSavedSnapshot(null)
  }, [open, user?.id, user?.name, user?.email, user?.role, user?.twoFactorEnabled])

  const isCurrentAdmin = parseRoles(user?.role).includes(ROLE.ADMIN)
  const canChange2FA = isCurrentAdmin && role === ROLE.ADMIN
  const effective2FA = canChange2FA && twoFactorEnabled
  const baseline = savedSnapshot ?? {
    name: user?.name ?? '', email: user?.email ?? '', role: user?.role ?? ROLE.USER,
    twoFactorEnabled: user?.twoFactorEnabled === true,
  }
  const changed = user != null && (
    name.trim() !== baseline.name || email.trim().toLowerCase() !== baseline.email ||
    role !== baseline.role || (isCurrentAdmin && effective2FA !== baseline.twoFactorEnabled) ||
    password.length > 0 || confirmPassword.length > 0
  )

  const changeOpen = (next: boolean) => {
    if (pending) return
    if (!next && changed && !window.confirm('Закрыть без сохранения изменений?')) return
    onOpenChange(next)
  }

  const save = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || pending || !changed) return
    if (password || confirmPassword) {
      const issue = validatePasswordConfirmation(password, confirmPassword)
      if (issue) { setError(issue); return }
    }
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      try {
        const result = await saveUserChangesAction({
          userId: user.id, name: name.trim(), email: email.trim(), role,
          twoFactorEnabled: effective2FA, newPassword: password,
        })
        if (result.error) {
          setError(result.error)
          if (result.profileSaved) router.refresh()
          return
        }
        setSavedSnapshot({ name: name.trim(), email: email.trim().toLowerCase(), role, twoFactorEnabled: effective2FA })
        setPassword('')
        setConfirmPassword('')
        setSuccess('Изменения сохранены.')
        router.refresh()
      } catch {
        setError('Не удалось сохранить изменения. Повторите попытку.')
      }
    })
  }

  const applyDangerousAction = () => {
    if (!user || !confirmation || pending) return
    if (confirmation === 'delete' && deleteText.trim() !== user.email) {
      setError('Для удаления точно введите email пользователя.')
      return
    }
    const id = user.id
    const operation = confirmation
    setError(null)
    startTransition(async () => {
      try {
        if (operation === 'delete') {
          await deleteUserAction(id)
          setConfirmation(null)
          onOpenChange(false)
        } else {
          await changeUserBanAction(id, operation === 'ban')
          setConfirmation(null)
          setSuccess(operation === 'ban' ? 'Пользователь заблокирован.' : 'Пользователь разблокирован.')
        }
        router.refresh()
      } catch (exception) {
        setError(exception instanceof Error ? exception.message : 'Операция не выполнена.')
      }
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={changeOpen}>
        <SheetContent side='right' className='flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-dashboard-border bg-dashboard-background p-0 text-brand-milk shadow-2xl sm:max-w-xl'>
          <SheetHeader className='shrink-0 border-b border-dashboard-border px-6 py-7 pr-16'>
            <SheetTitle className='text-xl text-brand-milk'>Управление пользователем</SheetTitle>
            <SheetDescription className='text-muted-foreground'>Профиль, права доступа и пароль</SheetDescription>
          </SheetHeader>

          <div className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
            {user && (
              <div className='space-y-6'>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='table' className='bg-dashboard-input text-brand-milk'>
                    {user.banned ? 'Заблокирован' : 'Активен'}
                  </Badge>
                  {isCurrentAdmin && (
                    <Badge variant='table' className='bg-dashboard-input text-brand-milk'>
                      {user.twoFactorEnabled ? '2FA включена' : '2FA выключена'}
                    </Badge>
                  )}
                </div>

                {error && <p role='alert' className='rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'>{error}</p>}
                {success && <p role='status' className='rounded-lg border border-dashboard-input-border bg-dashboard-input p-3 text-sm'>{success}</p>}

                <form id='edit-user-form' onSubmit={save} className='space-y-6'>
                  <section className='space-y-4'>
                    <h3 className='font-semibold'>Личные данные</h3>
                    <div className='space-y-2'>
                      <Label htmlFor='managed-name' className='text-brand-milk'>Имя</Label>
                      <Input id='managed-name' value={name} onChange={event => setName(event.target.value)}
                        minLength={2} maxLength={100} required disabled={pending}
                        className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='managed-email' className='text-brand-milk'>Email для входа</Label>
                      <Input id='managed-email' type='email' value={email} onChange={event => setEmail(event.target.value)}
                        required disabled={pending} className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
                      <p className='text-xs text-muted-foreground'>Изменение email завершит действующие сессии и сбросит признак подтверждения адреса.</p>
                    </div>
                  </section>

                  <section className='space-y-3 border-t border-dashboard-border pt-6'>
                    <h3 className='font-semibold'>Доступ</h3>
                    <div className='space-y-2'>
                      <Label htmlFor='managed-role' className='text-brand-milk'>Роль</Label>
                      <select id='managed-role' value={role} onChange={event => setRole(event.target.value as Role)}
                        disabled={pending} className='h-10 w-full rounded-lg border border-dashboard-input-border bg-dashboard-input px-3 text-sm text-brand-milk'>
                        {roles.map(item => <option key={item} value={item}>{ROLE_LABEL[item]}</option>)}
                      </select>
                      {parseRoles(user.role).length > 1 && (
                        <p className='text-xs text-amber-400'>Сейчас назначено несколько ролей. После сохранения останется одна выбранная роль.</p>
                      )}
                    </div>
                    {isCurrentAdmin && (
                      <label className='flex items-start gap-3 rounded-lg border border-dashboard-input-border bg-dashboard-input p-3'>
                        <input type='checkbox' checked={effective2FA} disabled={pending || !canChange2FA}
                          onChange={event => setTwoFactorEnabled(event.target.checked)} className='mt-1 accent-brand-terracota' />
                        <span><span className='block text-sm font-medium'>Подтверждение входа по email (2FA)</span>
                          <span className='mt-1 block text-xs text-muted-foreground'>Изменение 2FA завершает действующие сессии. При снятии роли администратора 2FA будет отключена.</span></span>
                      </label>
                    )}
                  </section>

                  <section className='space-y-4 border-t border-dashboard-border pt-6'>
                    <h3 className='font-semibold'>Изменение пароля</h3>
                    <p className='text-xs text-muted-foreground'>Оставьте поля пустыми, чтобы сохранить прежний пароль.</p>
                    <div className='space-y-2'>
                      <Label htmlFor='managed-password' className='text-brand-milk'>Новый пароль</Label>
                      <Input id='managed-password' type='password' autoComplete='new-password' value={password}
                        onChange={event => setPassword(event.target.value)} disabled={pending}
                        minLength={password ? PASSWORD_MIN_LENGTH : undefined} maxLength={PASSWORD_MAX_LENGTH}
                        className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='managed-password-confirm' className='text-brand-milk'>Повторите пароль</Label>
                      <Input id='managed-password-confirm' type='password' autoComplete='new-password' value={confirmPassword}
                        onChange={event => setConfirmPassword(event.target.value)} disabled={pending}
                        className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
                    </div>
                  </section>
                </form>
              </div>
            )}
          </div>

          <footer className='shrink-0 space-y-3 border-t border-dashboard-border bg-brand-charcoal px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
            <Button type='submit' form='edit-user-form' disabled={pending || !changed}
              className='h-11 w-full bg-brand-milk text-brand-charcoal hover:bg-brand-milk/90'>
              {pending ? 'Сохраняем…' : 'Сохранить изменения'}
            </Button>
            <div className='flex gap-2'>
              <Button type='button' variant='outline' disabled={pending || !user}
                onClick={() => setConfirmation(user?.banned ? 'unban' : 'ban')}
                className='flex-1 border-dashboard-input-border bg-dashboard-input text-brand-milk'>
                {user?.banned ? 'Разблокировать' : 'Заблокировать'}
              </Button>
              <Button type='button' variant='destructive' disabled={pending || !user}
                onClick={() => { setDeleteText(''); setConfirmation('delete') }} className='flex-1'>
                <Trash2 className='size-4' /> Удалить
              </Button>
            </div>
          </footer>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmation !== null} onOpenChange={next => { if (!next && !pending) setConfirmation(null) }}>
        <AlertDialogContent className='border border-dashboard-input-border bg-brand-charcoal text-brand-milk'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-brand-milk'>Подтвердите действие</AlertDialogTitle>
            <AlertDialogDescription className='text-muted-foreground'>
              {confirmation === 'delete' ? 'Учётная запись будет удалена без возможности восстановления.' :
                confirmation === 'ban' ? 'Пользователь потеряет доступ, все его сессии завершатся.' :
                  'Учётная запись снова получит доступ согласно назначенной роли.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {confirmation === 'delete' && user && (
            <div className='space-y-2'>
              <Label htmlFor='delete-email' className='text-brand-milk'>Для подтверждения введите {user.email}</Label>
              <Input id='delete-email' autoComplete='off' value={deleteText}
                onChange={event => setDeleteText(event.target.value)}
                className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Отмена</AlertDialogCancel>
            <Button type='button' variant={confirmation === 'unban' ? 'default' : 'destructive'}
              onClick={applyDangerousAction} disabled={pending || (confirmation === 'delete' && deleteText.trim() !== user?.email)}>
              {pending ? 'Выполняем…' : 'Подтвердить'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
