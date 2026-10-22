'use client'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteProjectAction } from '@/features/projects/server/actions'

export function DeleteProjectButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  return <div>
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" disabled={pending} />}>
        {pending ? 'Удаление…' : 'Удалить'}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить проект безвозвратно?</AlertDialogTitle>
          <AlertDialogDescription>Удаление нельзя отменить. Проект с загруженными фотографиями сначала необходимо очистить через управление галереей.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => {
            setError(null)
            startTransition(async () => {
              try { await deleteProjectAction(id) }
              catch { setError('Не удалось удалить проект. Проверьте права и наличие фотографий.') }
            })
          }}>Удалить проект</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    {error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}
  </div>
}
