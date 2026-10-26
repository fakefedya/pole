'use client'

import { useActionState, useEffect, useState } from 'react'
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
  status: 'DRAFT' | 'HIDDEN' | 'PUBLISHED'; showOnHome: boolean; homeOrder: number
}

export function ProjectForm({ project }: { project?: ProjectFormInitial }) {
  const [state, formAction, pending] = useActionState(saveProjectAction, initialProjectActionState)
  const [status, setStatus] = useState<string>(project?.status ?? 'DRAFT')
  const [showOnHome, setShowOnHome] = useState(project?.showOnHome ?? false)
  const errors = state.fieldErrors ?? {}

  useEffect(() => { if (state.error) toast.error(state.error) }, [state])

  return (
    <form action={formAction} noValidate className="mx-auto max-w-4xl space-y-6">
      {project && <input type="hidden" name="projectId" value={project.id} />}
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="text-3xl font-semibold tracking-tight">{project ? 'Редактирование проекта' : 'Новый проект'}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Сначала сохраните черновик; публикация доступна после добавления обложки.</p></div>
        <Button type="submit" disabled={pending}>{pending ? 'Сохранение…' : 'Сохранить'}</Button>
      </div>
      <Card>
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
      <Card><CardHeader><CardTitle>Описание проекта</CardTitle><CardDescription>Разделяйте абзацы пустой строкой</CardDescription></CardHeader>
        <CardContent><DashboardTextareaField id="description" name="description" label="Текст проекта" rows={9} defaultValue={project?.description ?? ''} error={errors.description} /></CardContent>
      </Card>
      <Card><CardHeader><CardTitle>Публикация</CardTitle></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <input type="hidden" name="status" value={status} />
          <DashboardSelectField id="status" label="Статус" value={status} onValueChange={setStatus} options={statusOptions} error={errors.status} />
          <DashboardInputField id="homeOrder" name="homeOrder" type="number" label="Порядок на главной" defaultValue={project?.homeOrder ?? 0} min={0} max={10000} error={errors.homeOrder} />
          <div className="sm:col-span-2">
            <DashboardCheckboxField id="showOnHome" label="Показывать на главной после публикации" checked={showOnHome} onCheckedChange={setShowOnHome} error={errors.showOnHome} />
            {showOnHome && <input type="hidden" name="showOnHome" value="on" />}
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">Добавление изображений и обложки — следующий этап. Пока без обложки проект опубликовать нельзя.</p>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? 'Сохранение…' : 'Сохранить проект'}</Button></div>
    </form>
  )
}
