'use client'

import { startTransition, useActionState, useEffect, useState, type SubmitEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DashboardInputField, DashboardTextareaField, DashboardSelectField, DashboardCheckboxField } from '@/features/dashboard/components/dashboard-form-controls'
import { saveProjectAction, type ProjectActionState } from '@/features/projects/server/actions'

const initialProjectActionState: ProjectActionState = { error: null }
const statusOptions = [
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'HIDDEN', label: 'Скрыт' },
  { value: 'PUBLISHED', label: 'Опубликован' },
] as const

export type ProjectFormInitial = {
  id: string; title: string; slug: string; summary: string | null; tags: string[];
  location: string | null; style: string | null; designDuration: string | null;
  areaSqM: string | null; year: number | null; description: string;
  status: 'DRAFT' | 'HIDDEN' | 'PUBLISHED'; showOnHome: boolean; homeOrder: number; hasCover?: boolean
}

export function ProjectForm({ project }: { project?: ProjectFormInitial }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(saveProjectAction, initialProjectActionState)
  const [status, setStatus] = useState<string>(project?.status ?? 'DRAFT')
  const [showOnHome, setShowOnHome] = useState(project?.showOnHome ?? false)
  const errors = state.fieldErrors ?? {}

  useEffect(() => { if (state.error) toast.error(state.error) }, [state.error])
  useEffect(() => {
    if (state.savedAt) {
      toast.success('Изменения проекта сохранены.')
      router.refresh()
    }
  }, [state.savedAt, router])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    // Create FormData before scheduling the transition: React clears event.currentTarget.
    const values = new FormData(event.currentTarget)
    // Bypass <form action={...}> to prevent React 19 resetting uncontrolled
    // input/textarea elements when a Server Action returns validation errors.
    startTransition(() => { formAction(values) })
  }

  return (
    <form id='project-editor-form' onSubmit={handleSubmit} noValidate className='min-w-0 space-y-6'>
      {project && <input type="hidden" name="projectId" value={project.id} />}
      <div className='sticky top-0 z-20 -mx-2 flex flex-wrap items-center justify-between gap-3 border-b border-dashboard-border bg-dashboard-background/95 px-2 py-4 backdrop-blur-md'>
        <div className='min-w-0'>
          <Link href='/dashboard/projects' className='inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-brand-milk'>
            <ArrowLeft className='size-3.5' aria-hidden='true' /> Все проекты
          </Link>
          <div className='mt-1 flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-semibold tracking-tight text-brand-milk'>
              {project ? 'Редактирование проекта' : 'Новый проект'}
            </h1>
            <Badge variant='outline' className='text-brand-milk'>
              {statusOptions.find((item) => item.value === status)?.label ?? 'Черновик'}
            </Badge>
          </div>
          {project && <p className='mt-1 truncate text-xs text-muted-foreground'>{project.title}</p>}
        </div>
        <div className='flex items-center gap-2'>
          <Button type='submit' disabled={pending} className='rounded-md'>
            {pending ? 'Сохранение…' : <><Save className='size-4' aria-hidden='true' /> Сохранить</>}
          </Button>
        </div>
      </div>
      {project && (
        <nav aria-label='Разделы проекта' className='flex flex-wrap gap-2 text-xs'>
          <a href='#project-main' className='rounded-md border border-dashboard-border px-3 py-2 text-brand-milk hover:bg-dashboard-input'>Основное</a>
          <a href='#project-description' className='rounded-md border border-dashboard-border px-3 py-2 text-brand-milk hover:bg-dashboard-input'>Описание</a>
          <a href='#project-publication' className='rounded-md border border-dashboard-border px-3 py-2 text-brand-milk hover:bg-dashboard-input'>Публикация</a>
          <a href='#project-gallery' className='rounded-md border border-dashboard-border px-3 py-2 text-brand-milk hover:bg-dashboard-input'>Галерея</a>
        </nav>
      )}
      <section id="project-main" className="scroll-mt-28">
      <Card className="border-dashboard-border bg-dashboard-background text-brand-milk">
        <CardHeader><CardTitle>Основное</CardTitle><CardDescription>Название, адрес страницы и описание</CardDescription></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <DashboardInputField id="title" name="title" label="Название *" defaultValue={project?.title} error={errors.title} />
          <DashboardInputField id="slug" name="slug" label="URL-адрес (латиницей) *" defaultValue={project?.slug} error={errors.slug} />
          <div className="sm:col-span-2"><DashboardTextareaField id="summary" name="summary" label="Краткое описание" defaultValue={project?.summary ?? ''} maxLength={320} error={errors.summary} /></div>
          <div className="sm:col-span-2"><DashboardInputField id="tagsText" name="tagsText" label="Теги через запятую" defaultValue={project?.tags.join(', ') ?? ''} error={errors.tagsText} placeholder="Квартира, минимализм, светлый интерьер" /></div>
          <DashboardInputField id="location" name="location" label="Локация" defaultValue={project?.location ?? ''} error={errors.location} />
          <DashboardInputField id="style" name="style" label="Стиль" defaultValue={project?.style ?? ''} error={errors.style} />
          <DashboardInputField id="areaSqM" name="areaSqM" label="Площадь, м²" defaultValue={project?.areaSqM ?? ''} error={errors.areaSqM} />
          <DashboardInputField id="designDuration" name="designDuration" label="Срок разработки" defaultValue={project?.designDuration ?? ''} error={errors.designDuration} />
          <DashboardInputField id="year" name="year" label="Год" defaultValue={project?.year ?? ''} error={errors.year} />
        </CardContent>
      </Card>
      </section>
      <section id="project-description" className="scroll-mt-28">
      <Card className="border-dashboard-border bg-dashboard-background text-brand-milk"><CardHeader><CardTitle>Описание проекта</CardTitle><CardDescription>Абзацы разделяйте пустой строкой. Заголовок: ## Название</CardDescription></CardHeader>
        <CardContent><DashboardTextareaField id="description" name="description" label="Текст проекта" rows={9} defaultValue={project?.description ?? ''} error={errors.description} /></CardContent>
      </Card>
      </section>
      <section id="project-publication" className="scroll-mt-28">
      <Card className="border-dashboard-border bg-dashboard-background text-brand-milk"><CardHeader><CardTitle>Публикация</CardTitle></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <input type="hidden" name="status" value={status} />
          <DashboardSelectField id="status" label="Статус" value={status} onValueChange={setStatus} options={project ? statusOptions : statusOptions.filter((item) => item.value !== 'PUBLISHED')} error={errors.status} />
          <DashboardInputField id="homeOrder" name="homeOrder" type="number" label="Порядок на главной" defaultValue={project?.homeOrder ?? 0} min={0} max={10000} error={errors.homeOrder} />
          <div className="sm:col-span-2">
            <DashboardCheckboxField id="showOnHome" label="Показывать на главной после публикации" checked={showOnHome} onCheckedChange={setShowOnHome} error={errors.showOnHome} />
            {showOnHome && <input type="hidden" name="showOnHome" value="on" />}
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">{!project ? 'Создайте черновик, затем загрузите фотографии и выберите обложку.' : project.hasCover ? 'Обложка назначена. Проект готов к публикации.' : 'Выберите обложку в галерее: без неё публикация недоступна.'}</p>
        </CardContent>
      </Card>
      </section>
      <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? 'Сохранение…' : 'Сохранить проект'}</Button></div>
    </form>
  )
}