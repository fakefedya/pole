'use client'

import { useState, useTransition, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { ROLE, ROLE_LABEL } from '@/lib/auth/authorization'
import { createUserAction } from '@/features/users/server/actions'
import {
  PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, validatePasswordConfirmation,
} from '@/features/auth/schemas/password'

const roles = [ROLE.EDITOR, ROLE.ADMIN, ROLE.USER] as const
type Props = { open: boolean; onOpenChange: (next: boolean) => void }

export function CreateUserSheet({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formVersion, setFormVersion] = useState(0)

  const changeOpen = (next: boolean) => {
    if (pending) return
    if (next && !open) {
      setError(null)
      setSuccess(false)
      setFormVersion(version => version + 1)
    }
    onOpenChange(next)
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    const password = String(data.get('password') ?? '')
    const confirm = String(data.get('confirmPassword') ?? '')
    const problem = validatePasswordConfirmation(password, confirm)
    if (problem) { setError(problem); return }
    setError(null)
    startTransition(async () => {
      try {
        const result = await createUserAction({
          name: String(data.get('name') ?? '').trim(),
          email: String(data.get('email') ?? '').trim(),
          role: String(data.get('role') ?? ROLE.EDITOR), password,
        })
        if (result.error) { setError(result.error); return }
        form.reset()
        setSuccess(true)
        router.refresh()
      } catch {
        setError('Не удалось создать пользователя.')
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={changeOpen}>
      <SheetContent side='right' className='flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-dashboard-border bg-dashboard-background p-0 text-brand-milk sm:max-w-xl'>
        <SheetHeader className='shrink-0 border-b border-dashboard-border px-6 py-7 pr-16'>
          <SheetTitle className='text-xl text-brand-milk'>Новый пользователь</SheetTitle>
          <SheetDescription className='text-muted-foreground'>Создание аккаунта и назначение роли</SheetDescription>
        </SheetHeader>

        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-6'>
          {error && <p role='alert' className='mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'>{error}</p>}
          {success ? (
            <div className='space-y-3 rounded-lg border border-dashboard-input-border bg-dashboard-input p-4'>
              <p role='status' className='font-semibold'>Пользователь создан</p>
              <p className='text-sm text-muted-foreground'>Пароль сохранён в Better Auth в виде хеша.</p>
            </div>
          ) : (
            <form id='create-user-form' key={formVersion} onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <Label htmlFor='create-user-name' className='text-brand-milk'>Имя</Label>
                <Input id='create-user-name' name='name' minLength={2} maxLength={100} required autoComplete='off'
                  className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='create-user-email' className='text-brand-milk'>Email</Label>
                <Input id='create-user-email' name='email' type='email' required autoComplete='off'
                  className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='create-user-role' className='text-brand-milk'>Роль</Label>
                <select id='create-user-role' name='role' defaultValue={ROLE.EDITOR}
                  className='h-10 w-full rounded-lg border border-dashboard-input-border bg-dashboard-input px-3 text-sm text-brand-milk'>
                  {roles.map(role => <option key={role} value={role}>{ROLE_LABEL[role]}</option>)}
                </select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='create-user-password' className='text-brand-milk'>Пароль</Label>
                <Input id='create-user-password' name='password' type='password' autoComplete='new-password'
                  minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_LENGTH} required
                  className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
                <p className='text-xs text-muted-foreground'>{PASSWORD_MIN_LENGTH}–{PASSWORD_MAX_LENGTH} символов. Используйте уникальную парольную фразу.</p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='create-user-password-confirm' className='text-brand-milk'>Повторите пароль</Label>
                <Input id='create-user-password-confirm' name='confirmPassword' type='password' autoComplete='new-password' required
                  className='border-dashboard-input-border bg-dashboard-input text-brand-milk' />
              </div>
            </form>
          )}
        </div>

        <footer className='shrink-0 flex gap-3 border-t border-dashboard-border bg-brand-charcoal px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <Button type='button' variant='outline' disabled={pending} onClick={() => changeOpen(false)}
            className='flex-1 border-dashboard-input-border bg-dashboard-input text-brand-milk'>
            {success ? 'Закрыть' : 'Отмена'}
          </Button>
          {!success && <Button type='submit' form='create-user-form' disabled={pending}
            className='flex-1 bg-brand-milk text-brand-charcoal hover:bg-brand-milk/90'>
            {pending ? 'Создание…' : 'Создать пользователя'}
          </Button>}
        </footer>
      </SheetContent>
    </Sheet>
  )
}
