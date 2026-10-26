'use client'

import Image from 'next/image'
import { useRef, useState, useTransition, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DashboardInputField } from '@/features/dashboard/components/dashboard-form-controls'
import {
  changeProjectImageAltAction, commitProjectImageAction,
  moveProjectImageAction, removeProjectImageAction, setProjectCoverAction,
} from '@/features/projects/server/media-actions'

export type GalleryImage = {
  id: string
  alt: string
  width: number
  height: number
  url: string
}

type Props = {
  projectId: string
  images: GalleryImage[]
  coverImageId: string | null
}

function GalleryTile({ projectId, item, index, images, coverImageId, busy, execute }: {
  projectId: string; item: GalleryImage; index: number; images: GalleryImage[];
  coverImageId: string | null; busy: boolean;
  execute: (fn: () => Promise<void>, success: string) => void;
}) {
  const [alt, setAlt] = useState(item.alt)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const isCover = coverImageId === item.id
  const move = (other: number) => {
    const ids = images.map((image) => image.id)
    ;[ids[index], ids[other]] = [ids[other], ids[index]]
    execute(() => moveProjectImageAction(projectId, ids), 'Порядок фотографий изменён.')
  }
  return <div className='space-y-3 rounded-lg border border-dashboard-border bg-dashboard-input p-3'>
    <div className='relative aspect-[4/3] overflow-hidden rounded-sm bg-dashboard-background'>
      <Image src={item.url} alt={item.alt} unoptimized fill sizes='(max-width: 700px) 100vw, 360px' className='object-cover' />
      {isCover && <span className='absolute left-2 top-2 rounded-sm bg-brand-charcoal px-2 py-1 text-xs text-brand-milk'>Обложка</span>}
    </div>
    <DashboardInputField id={`alt-${item.id}`} label='Описание (alt)' value={alt} onChange={(event) => setAlt(event.target.value)} disabled={busy} maxLength={240} />
    <div className='flex flex-wrap gap-2'>
      <Button type='button' size='sm' variant='outline' disabled={busy || alt.trim() === item.alt || alt.trim().length < 2}
        onClick={() => execute(() => changeProjectImageAltAction(projectId, item.id, alt), 'Описание изображения сохранено.')}>
        Сохранить alt
      </Button>
      <Button type='button' size='sm' variant='outline' disabled={busy || isCover}
        onClick={() => execute(() => setProjectCoverAction(projectId, item.id), 'Обложка обновлена.')}>
        <Star className='size-4' /> Обложка
      </Button>
      <Button type='button' size='sm' variant='outline' disabled={busy || index === 0} aria-label='Выше' onClick={() => move(index - 1)}>
        <ArrowUp className='size-4' />
      </Button>
      <Button type='button' size='sm' variant='outline' disabled={busy || index >= images.length - 1} aria-label='Ниже' onClick={() => move(index + 1)}>
        <ArrowDown className='size-4' />
      </Button>
      <Button type='button' size='sm' variant='destructive' disabled={busy} onClick={() => setDeleteOpen(true)} aria-label='Удалить изображение'><Trash2 className='size-4' /></Button>
    </div>
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Удалить фотографию?</AlertDialogTitle>
          <AlertDialogDescription>{isCover ? 'Это обложка. Опубликованный проект перейдёт в черновики.' : 'Изображение будет удалено из галереи и очередью из S3.'}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={() => execute(() => removeProjectImageAction(projectId, item.id), 'Изображение удалено.')}>
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
}

export function ProjectGallery({ projectId, images, coverImageId }: Props) {
  const router = useRouter()
  const picker = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [pending, startTransition] = useTransition()
  const busy = uploading || pending

  const execute = (action: () => Promise<void>, message: string) => {
    if (busy) return
    startTransition(async () => {
      try { await action(); toast.success(message); router.refresh() }
      catch (error) { toast.error(error instanceof Error ? error.message : 'Операция не выполнена.') }
    })
  }

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length || busy) return
    if (images.length + files.length > 100) { toast.error('Максимум 100 изображений в галерее.'); return }
    setUploading(true)
    try {
      for (const [index, file] of files.entries()) {
        if (file.size > 12 * 1024 * 1024) throw new Error(`«${file.name}»: максимум 12 МБ.`)
        setUploadStatus(`Загрузка ${index + 1} из ${files.length}: ${file.name}`)
        const body = new FormData()
        body.append('projectId', projectId)
        body.append('file', file)
        const response = await fetch('/api/dashboard/projects/uploads', {
          method: 'POST', body, credentials: 'same-origin', cache: 'no-store',
        })
        const payload = await response.json() as { uploadId?: string; error?: string }
        if (!response.ok || !payload.uploadId) throw new Error(payload.error ?? 'Загрузка не удалась.')
        setUploadStatus(`Подтверждение ${index + 1} из ${files.length}`)
        const suggestedAlt = file.name.replace(/\.[^.]+$/, '').trim()
        await commitProjectImageAction(projectId, payload.uploadId,
          suggestedAlt.length >= 2 ? suggestedAlt.slice(0, 240) : 'Фото интерьера')
      }
      toast.success('Галерея обновлена.')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось загрузить фотографии.')
      // If staging succeeded but promotion failed, private tmp is cleaned by S3 lifecycle.
      router.refresh()
    } finally { setUploading(false); setUploadStatus('') }
  }

  return <section className='space-y-5 rounded-lg border border-dashboard-border bg-dashboard-background p-5'>
    <div className='flex flex-wrap items-start justify-between gap-4'>
      <div><h2 className='text-xl font-medium text-brand-milk'>Фотографии проекта</h2>
        <p className='mt-1 text-sm text-muted-foreground'>JPG, PNG, WebP, AVIF · до 12 МБ · максимум 100 фото. Обложка обязательна для публикации.</p>
      </div>
      <input ref={picker} type='file' accept='image/jpeg,image/png,image/webp,image/avif' multiple className='sr-only' aria-label='Выберите изображения' onChange={uploadFiles} disabled={busy} />
      <Button type='button' disabled={busy} onClick={() => picker.current?.click()}>
        <ImagePlus className='size-4' /> {uploading ? 'Загружаем…' : 'Добавить фото'}
      </Button>
    </div>
    {uploadStatus && <p role='status' className='text-sm text-brand-milk'>{uploadStatus}</p>}
    {images.length === 0 ? <p className='rounded-lg border border-dashed border-dashboard-border p-10 text-center text-muted-foreground'>Пока нет фотографий. Добавьте изображения и назначьте обложку.</p> :
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {images.map((image, index) => <GalleryTile key={image.id} projectId={projectId} item={image} index={index} images={images} coverImageId={coverImageId} busy={busy} execute={execute} />)}
      </div>}
  </section>
}
