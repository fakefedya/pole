'use client'

import Image from 'next/image'
import { useOptimistic, useRef, useState, useTransition, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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

type GalleryTileProps = {
  projectId: string
  item: GalleryImage
  index: number
  images: GalleryImage[]
  coverImageId: string | null
  busy: boolean
  execute: (fn: () => Promise<void>, success: string) => void
  onSelectCover: (imageId: string) => void
}

function GalleryTile({
  projectId, item, index, images, coverImageId,
  busy, execute, onSelectCover,
}: GalleryTileProps) {
  const [alt, setAlt] = useState(item.alt)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const isCover = coverImageId === item.id

  const move = (other: number) => {
    const ids = images.map((image) => image.id)
    ;[ids[index], ids[other]] = [ids[other], ids[index]]
    execute(() => moveProjectImageAction(projectId, ids), 'Порядок фотографий изменён.')
  }

  return (
    <article className={cn(
      'overflow-hidden rounded-lg border bg-dashboard-input p-3 transition-[border-color,box-shadow] duration-200',
      isCover
        ? 'border-brand-terracota ring-2 ring-brand-terracota/70 shadow-[0_0_0_3px_rgb(149_69_32_/_0.12)]'
        : 'border-dashboard-border',
    )}>
      <div className='relative aspect-[4/3] overflow-hidden rounded-sm bg-dashboard-background'>
        <Image src={item.url} alt={item.alt} unoptimized fill
          sizes='(max-width: 700px) 100vw, 360px' className='object-cover' />
        {isCover && (
          <div className='absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-3'>
            <span className='inline-flex items-center gap-1.5 rounded-md bg-brand-terracota px-3 py-1.5 text-xs font-semibold text-white'>
              <Star className='size-3.5 fill-current' aria-hidden='true' /> Обложка проекта
            </span>
            <CheckCircle2 className='size-5 text-white' aria-label='Текущая обложка' />
          </div>
        )}
      </div>
      <div className='mt-3'>
        <DashboardInputField id={`alt-${item.id}`} label='Описание изображения (alt)'
          value={alt} onChange={(event) => setAlt(event.target.value)} disabled={busy} maxLength={240} />
      </div>
      <div className='mt-3 flex flex-wrap gap-2'>
        <Button type='button' size='sm' variant='outline'
          disabled={busy || alt.trim() === item.alt || alt.trim().length < 2}
          onClick={() => execute(() => changeProjectImageAltAction(projectId, item.id, alt), 'Alt сохранён.')}>
          Сохранить alt
        </Button>
        <Button type='button' size='sm' variant={isCover ? 'secondary' : 'outline'}
          aria-pressed={isCover} disabled={busy || isCover}
          onClick={() => onSelectCover(item.id)}>
          <Star className={cn('size-4', isCover && 'fill-current')} aria-hidden='true' />
          {isCover ? 'Выбрана' : 'Сделать обложкой'}
        </Button>
        <Button type='button' size='sm' variant='outline' disabled={busy || index === 0}
          aria-label='Переместить выше' onClick={() => move(index - 1)}>
          <ArrowUp className='size-4' aria-hidden='true' />
        </Button>
        <Button type='button' size='sm' variant='outline'
          disabled={busy || index >= images.length - 1}
          aria-label='Переместить ниже' onClick={() => move(index + 1)}>
          <ArrowDown className='size-4' aria-hidden='true' />
        </Button>
        <Button type='button' size='sm' variant='destructive' disabled={busy}
          onClick={() => setDeleteOpen(true)} aria-label='Удалить изображение'>
          <Trash2 className='size-4' aria-hidden='true' />
        </Button>
      </div>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить фотографию?</AlertDialogTitle>
            <AlertDialogDescription>
              {isCover
                ? 'Это обложка. Опубликованный проект перейдёт в черновики, пока вы не выберете новую.'
                : 'Фотография будет удалена из галереи и поставлена в очередь очистки S3.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction variant='destructive'
              onClick={() => execute(() => removeProjectImageAction(projectId, item.id), 'Фотография удалена.')}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  )
}

export function ProjectGallery({ projectId, images, coverImageId }: Props) {
  const router = useRouter()
  const picker = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [pending, startTransition] = useTransition()
  const [selectedCoverId, setSelectedCoverId] = useOptimistic(
    coverImageId,
    (_current: string | null, next: string) => next,
  )
  const busy = uploading || pending
  const selectedCover = images.find((item) => item.id === selectedCoverId)

  const execute = (action: () => Promise<void>, message: string) => {
    if (busy) return
    startTransition(async () => {
      try {
        await action()
        toast.success(message)
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Операция не выполнена.')
      }
    })
  }

  const chooseCover = (imageId: string) => {
    if (busy || selectedCoverId === imageId) return
    startTransition(async () => {
      // Optimistic state is scoped to the action and rolls back on failure.
      setSelectedCoverId(imageId)
      try {
        await setProjectCoverAction(projectId, imageId)
        toast.success('Обложка проекта обновлена.')
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Не удалось назначить обложку.')
      }
    })
  }

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length || busy) return
    if (images.length + files.length > 100) {
      toast.error('Максимум 100 изображений в галерее.')
      return
    }
    setUploading(true)
    try {
      for (const [index, file] of files.entries()) {
        if (file.size > 12 * 1024 * 1024) {
          throw new Error(`«${file.name}»: максимум 12 МБ.`)
        }
        setUploadStatus(`Загрузка ${index + 1} из ${files.length}: ${file.name}`)
        const body = new FormData()
        body.append('projectId', projectId)
        body.append('file', file)
        const response = await fetch('/api/dashboard/projects/uploads', {
          method: 'POST', body, credentials: 'same-origin', cache: 'no-store',
        })
        const payload = await response.json() as { uploadId?: string; error?: string }
        if (!response.ok || !payload.uploadId) {
          throw new Error(payload.error ?? 'Загрузка не удалась.')
        }
        setUploadStatus(`Подтверждение ${index + 1} из ${files.length}`)
        const suggestedAlt = file.name.replace(/\.[^.]+$/, '').trim()
        await commitProjectImageAction(
          projectId, payload.uploadId,
          suggestedAlt.length >= 2 ? suggestedAlt.slice(0, 240) : 'Фото интерьера',
        )
      }
      toast.success('Галерея обновлена.')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось загрузить фотографии.')
      // Uncommitted private staging objects are expired by the S3 lifecycle.
      router.refresh()
    } finally {
      setUploading(false)
      setUploadStatus('')
    }
  }

  return (
    <section className='space-y-5 rounded-lg border border-dashboard-border bg-dashboard-background p-5'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold text-brand-milk'>Галерея проекта</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            JPG, PNG, WebP, AVIF · до 12 МБ · до 100 фото. Выберите одну обложку для публикации.
          </p>
        </div>
        <input ref={picker} type='file' accept='image/jpeg,image/png,image/webp,image/avif'
          multiple className='sr-only' aria-label='Выберите изображения'
          onChange={uploadFiles} disabled={busy} />
        <Button type='button' disabled={busy} onClick={() => picker.current?.click()}>
          <ImagePlus className='size-4' aria-hidden='true' />
          {uploading ? 'Загружаем…' : 'Добавить фотографии'}
        </Button>
      </div>
      <div className={cn('flex items-center gap-4 rounded-lg border p-3',
        selectedCover ? 'border-brand-terracota/70 bg-brand-terracota/10' : 'border-dashed border-dashboard-border')}>
        {selectedCover ? (
          <div className='relative h-20 w-28 shrink-0 overflow-hidden rounded-md'>
            <Image src={selectedCover.url} alt={`Обложка: ${selectedCover.alt}`}
              unoptimized fill sizes='112px' className='object-cover' />
          </div>
        ) : (
          <div className='flex h-20 w-28 shrink-0 items-center justify-center rounded-md bg-dashboard-input'>
            <Star className='size-6 text-muted-foreground' aria-hidden='true' />
          </div>
        )}
        <div className='min-w-0'>
          <p className={cn('flex items-center gap-2 text-sm font-semibold',
            selectedCover ? 'text-brand-milk' : 'text-muted-foreground')}>
            {selectedCover && <CheckCircle2 className='size-4 text-brand-terracota' aria-hidden='true' />}
            {selectedCover ? 'Текущая обложка проекта' : 'Обложка не выбрана'}
          </p>
          <p className='mt-1 text-xs text-muted-foreground'>
            {selectedCover
              ? 'Эта фотография будет основной для карточки проекта и страницы портфолио.'
              : 'Нажмите «Сделать обложкой» под нужной фотографией.'}
          </p>
        </div>
      </div>
      {uploadStatus && <p role='status' className='text-sm text-brand-milk'>{uploadStatus}</p>}
      {images.length === 0 ? (
        <p className='rounded-lg border border-dashed border-dashboard-border p-10 text-center text-muted-foreground'>
          Пока нет фотографий. Добавьте изображения и назначьте обложку.
        </p>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {images.map((image, index) => (
            <GalleryTile key={image.id} projectId={projectId} item={image}
              index={index} images={images} coverImageId={selectedCoverId}
              busy={busy} execute={execute} onSelectCover={chooseCover} />
          ))}
        </div>
      )}
    </section>
  )
}
