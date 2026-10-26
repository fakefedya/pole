'use client'

import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { authClient } from '@/lib/auth/auth-client'

const RESEND_COOLDOWN_SECONDS = 60

export function VerifyOtpForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [pending, setPending] = useState(false)
  const [resending, setResending] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const resendInFlightRef = useRef(false)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = window.setTimeout(() => setResendCooldown(seconds => Math.max(0, seconds - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [resendCooldown])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    if (!/^\d{6}$/.test(code.trim())) { setCodeError('Введите шестизначный цифровой код.'); return }
    setCodeError(null); setPending(true)
    try {
      const result = await authClient.twoFactor.verifyOtp({ code: code.trim(), trustDevice: false })
      if (result.error) {
        setCodeError('Код неверный, просрочен или превышено число попыток.')
        toast.error('Подтверждение не выполнено.')
        return
      }
      router.replace('/dashboard'); router.refresh()
    } catch {
      toast.error('Ошибка соединения. Повторите попытку.')
    } finally { setPending(false) }
  }

  async function handleResend() {
    if (resendInFlightRef.current || resendCooldown > 0 || pending) return
    resendInFlightRef.current = true; setResending(true); setCodeError(null)
    try {
      const result = await authClient.twoFactor.sendOtp({ trustDevice: false })
      if (result.error) {
        if (result.error.status === 429) {
          setResendCooldown(RESEND_COOLDOWN_SECONDS)
          toast.error('Слишком много запросов. Повторите позже.')
        } else toast.error('Не удалось запросить код. Начните вход заново, если необходимо.')
        return
      }
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
      toast.success('Новый код запрошен. Проверьте почту.')
    } catch { toast.error('Ошибка отправки кода.') }
    finally { resendInFlightRef.current = false; setResending(false) }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Подтверждение входа</h1>
        <p className="text-sm opacity-70">Введите шестизначный код из письма.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field data-invalid={codeError ? true : undefined}>
          <FieldLabel htmlFor="login-otp">Код подтверждения</FieldLabel>
          <Input id="login-otp" value={code} onChange={event => { setCode(event.target.value); setCodeError(null) }}
            type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} aria-invalid={Boolean(codeError)} />
          {codeError && <FieldError>{codeError}</FieldError>}
        </Field>
        <Button type="submit" disabled={pending}>{pending ? 'Проверяем…' : 'Подтвердить'}</Button>
      </form>
      <div className="flex flex-col items-start gap-3">
        <Button type="button" variant="link" disabled={pending || resending || resendCooldown > 0} onClick={handleResend}>
          {resending ? 'Отправляем…' : resendCooldown > 0 ? `Отправить повторно через ${resendCooldown} сек.` : 'Отправить код повторно'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.replace('/dashboard/login')}>Вернуться ко входу</Button>
      </div>
    </div>
  )
}
