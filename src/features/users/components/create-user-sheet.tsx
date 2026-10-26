'use client'

import { useState, useTransition, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { DashboardInputField, DashboardSelectField } from '@/features/dashboard/components/dashboard-form-controls'
import { createUserAction } from '@/features/users/server/actions'
import { createUserSchema } from '@/features/users/schemas/user'
import { fieldErrorsFromZod } from '@/features/dashboard/lib/form-errors'
import { ROLE, ROLE_LABEL } from '@/lib/auth/authorization'

const roles = [ROLE.EDITOR, ROLE.ADMIN, ROLE.USER].map(value => ({ value, label: ROLE_LABEL[value] }))
type Props = { open: boolean; onOpenChange: (next: boolean) => void }

type Fields = 'name' | 'email' | 'role' | 'password' | 'confirmPassword'

export function CreateUserSheet({ open, onOpenChange }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>(ROLE.EDITOR)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (key: Fields, value: string) => {
    const setter = { name: setName, email: setEmail, role: setRole, password: setPassword, confirmPassword: setConfirmPassword }[key]
    setter(value)
    setErrors(old => { const next = { ...old }; delete next[key]; return next })
  }
  const reset = () => {
    setName(''); setEmail(''); setRole(ROLE.EDITOR)
    setPassword(''); setConfirmPassword(''); setErrors({})
  }
  const changeOpen = (next: boolean) => {
    if (pending) return
    if (next && !open) reset()
    onOpenChange(next)
  }
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const parsed = createUserSchema.safeParse({ name, email, role, password })
    const nextErrors = parsed.success ? {} : fieldErrorsFromZod(parsed.error)
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Пароли не совпадают.'
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); toast.error('Проверьте поля формы.'); return }
    setErrors({})
    startTransition(async () => {
      try {
        const result = await createUserAction({ name, email, role, password })
        if (result.error) {
          setErrors(result.fieldErrors ?? {})
          toast.error(result.error)
          return
        }
        toast.success('Пользователь создан.')
        reset()
        onOpenChange(false)
        router.refresh()
      } catch {
        toast.error('Не удалось создать пользователя.')
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={changeOpen}>
      <SheetContent side="right" className="flex h-dvh max-h-dvh w-full flex-col gap-0 overflow-hidden border-dashboard-border bg-dashboard-background p-0 text-brand-milk sm:max-w-xl">
        <SheetHeader className="shrink-0 border-b border-dashboard-border px-6 py-7 pr-16">
          <SheetTitle className="text-xl text-brand-milk">Новый пользователь</SheetTitle>
          <SheetDescription className="text-muted-foreground">Создание аккаунта и назначение роли</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <form noValidate id="create-user-form" onSubmit={handleSubmit} className="space-y-5">
            <DashboardInputField id="create-user-name" label="Имя" value={name} onChange={e => update('name', e.target.value)}
              error={errors.name} autoComplete="off" disabled={pending} />
            <DashboardInputField id="create-user-email" label="Email" type="email" value={email} onChange={e => update('email', e.target.value)}
              error={errors.email} autoComplete="off" disabled={pending} />
            <DashboardSelectField id="create-user-role" label="Роль" options={roles} value={role} onValueChange={v => update('role', v)}
              error={errors.role} disabled={pending} />
            <DashboardInputField id="create-user-password" label="Пароль" type="password" autoComplete="new-password"
              value={password} onChange={e => update('password', e.target.value)} error={errors.password} disabled={pending}
              description="От 12 до 128 символов. Используйте уникальную длинную парольную фразу." />
            <DashboardInputField id="create-user-password-confirm" label="Повторите пароль" type="password" autoComplete="new-password"
              value={confirmPassword} onChange={e => update('confirmPassword', e.target.value)} error={errors.confirmPassword} disabled={pending} />
          </form>
        </div>
        <footer className="shrink-0 flex gap-3 border-t border-dashboard-border bg-brand-charcoal px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button type="button" variant="outline" disabled={pending} onClick={() => changeOpen(false)}
            className="flex-1 border-dashboard-input-border bg-dashboard-input text-brand-milk">Отмена</Button>
          <Button type="submit" form="create-user-form" disabled={pending}
            className="flex-1 bg-brand-milk text-brand-charcoal hover:bg-brand-milk/90">
            {pending ? 'Создание…' : 'Создать пользователя'}
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  )
}
