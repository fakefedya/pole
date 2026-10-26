'use client'

import { useState, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { authClient } from '@/lib/auth/auth-client'

const credentialsSchema = z.object({
  email: z.email('Укажите действительный email.'),
  password: z.string().min(1, 'Введите пароль.'),
})

export function LoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const parsed = credentialsSchema.safeParse({ email: email.trim(), password })
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message
      setErrors(next)
      return
    }
    setPending(true); setErrors({})
    try {
      const result = await authClient.signIn.email({ email: parsed.data.email, password, rememberMe: false })
      if (result.error) {
        setErrors({ password: 'Неверные учётные данные или доступ заблокирован.' })
        toast.error('Не удалось войти.')
        return
      }
      if (result.data && 'twoFactorRedirect' in result.data && result.data.twoFactorRedirect) {
        const otp = await authClient.twoFactor.sendOtp({ trustDevice: false })
        if (otp.error) { toast.error('Не удалось отправить код. Повторите попытку позже.'); return }
        router.replace('/dashboard/verify')
        return
      }
      router.replace('/dashboard'); router.refresh()
    } catch {
      toast.error('Ошибка соединения. Повторите попытку.')
    } finally { setPending(false) }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-sm flex-col gap-5">
      <h1 className="text-3xl font-semibold">Вход в STUDIO POLE</h1>
      <Field data-invalid={errors.email ? true : undefined}>
        <FieldLabel htmlFor="login-email">Электронная почта</FieldLabel>
        <Input id="login-email" type="email" autoComplete="username" value={email}
          onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })) }} aria-invalid={Boolean(errors.email)} />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </Field>
      <Field data-invalid={errors.password ? true : undefined}>
        <FieldLabel htmlFor="login-password">Пароль</FieldLabel>
        <Input id="login-password" type="password" autoComplete="current-password" value={password}
          onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })) }} aria-invalid={Boolean(errors.password)} />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>
      <Button type="submit" disabled={pending}>{pending ? 'Входим…' : 'Войти'}</Button>
    </form>
  )
}
