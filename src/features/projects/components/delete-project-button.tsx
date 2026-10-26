'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteProjectAction } from '@/features/projects/server/actions'

export function DeleteProjectButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button variant="destructive" size="sm" disabled={pending} />}>
        {pending ? 'Удаление…' : 'Удалить'}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить проект безвозвратно?</AlertDialogTitle>
          <AlertDialogDescription>
            Удаление нельзя отменить. При наличии изображений сначала потребуется очистить галерею.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Отмена</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={pending} onClick={() => {
            startTransition(async () => {
              try { await deleteProjectAction(id); toast.success('Проект удалён.') }
              catch (error) { toast.error(error instanceof Error ? error.message : 'Не удалось удалить проект.') }
              finally { setOpen(false) }
            })
          }}>Удалить проект</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
