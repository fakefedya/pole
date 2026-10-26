'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteProjectAction } from '@/features/projects/server/actions'

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  return <>
    <Button variant='destructive' size='sm' disabled={pending} onClick={() => setOpen(true)}>
      <Trash2 className='size-4' /> Удалить
    </Button>
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Безвозвратно удалить проект?</AlertDialogTitle>
          <AlertDialogDescription>
            Проект и записи галереи будут удалены. Файлы удаляются через очередь S3, повторяемую при сбоях.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Отмена</AlertDialogCancel>
          <AlertDialogAction variant='destructive' disabled={pending} onClick={() => {
            startTransition(async () => {
              try {
                await deleteProjectAction(id)
                toast.success('Проект удалён.')
                router.refresh()
              } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Не удалось удалить проект.')
              } finally { setOpen(false) }
            })
          }}>Удалить проект</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
}
