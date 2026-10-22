'use client'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { saveProjectAction, type ProjectActionState } from '@/features/projects/server/actions'

const initialProjectActionState: ProjectActionState = { error: null }

export type ProjectFormInitial = {
  id: string; title: string; slug: string; summary: string | null; tags: string[];
  location: string | null; style: string | null; designDuration: string | null;
  areaSqM: string | null; year: number | null; description: string;
  status: 'DRAFT'|'HIDDEN'|'PUBLISHED'; showOnHome: boolean; homeOrder: number
}

function Field({ name, label, defaultValue, type = 'text' }: { name: string; label: string; defaultValue?: string | number; type?: string }) {
  return <div className="grid gap-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} type={type} defaultValue={defaultValue} /></div>
}

export function ProjectForm({ project }: { project?: ProjectFormInitial }) {
  const [state, formAction, pending] = useActionState(saveProjectAction, initialProjectActionState)
  return (
    <form action={formAction} className="mx-auto max-w-4xl space-y-6">
      {project && <input type="hidden" name="projectId" value={project.id} />}
      <div className="flex items-center justify-between gap-3"><div><h1 className="text-3xl font-semibold tracking-tight">{project ? 'Редактирование проекта' : 'Новый проект'}</h1>
        <p className="mt-2 text-sm text-neutral-500">Сначала сохраните черновик; публикация доступна после добавления обложки.</p></div>
        <Button type="submit" disabled={pending}>{pending ? 'Сохранение…' : 'Сохранить'}</Button></div>
      {state.error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{state.error}</p>}
      <Card><CardHeader><CardTitle>Основное</CardTitle><CardDescription>Название, адрес страницы и описание</CardDescription></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field name="title" label="Название *" defaultValue={project?.title} />
          <Field name="slug" label="URL-адрес (латиницей) *" defaultValue={project?.slug} />
          <div className="sm:col-span-2 grid gap-2"><Label htmlFor="summary">Краткое описание</Label>
            <Textarea name="summary" id="summary" defaultValue={project?.summary ?? ''} maxLength={320}/></div>
          <div className="sm:col-span-2 grid gap-2"><Label htmlFor="tagsText">Теги через запятую</Label>
            <Input name="tagsText" id="tagsText" defaultValue={project?.tags.join(', ') ?? ''} placeholder="Квартира, минимализм, светлый интерьер" /></div>
          <Field name="location" label="Локация" defaultValue={project?.location ?? ''} />
          <Field name="style" label="Стиль" defaultValue={project?.style ?? ''} />
          <Field name="areaSqM" label="Площадь, м²" defaultValue={project?.areaSqM ?? ''} />
          <Field name="designDuration" label="Срок разработки" defaultValue={project?.designDuration ?? ''} />
          <Field name="year" label="Год" defaultValue={project?.year ?? ''} />
        </CardContent></Card>
      <Card><CardHeader><CardTitle>Описание проекта</CardTitle><CardDescription>Разделяйте абзацы пустой строкой</CardDescription></CardHeader>
        <CardContent><Textarea name="description" rows={9} defaultValue={project?.description ?? ''}/></CardContent></Card>
      <Card><CardHeader><CardTitle>Публикация</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2"><Label htmlFor="status">Статус</Label>
          <select id="status" name="status" defaultValue={project?.status ?? 'DRAFT'} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
            <option value="DRAFT">Черновик</option><option value="HIDDEN">Скрыт</option><option value="PUBLISHED">Опубликован</option>
          </select></div>
        <Field name="homeOrder" label="Порядок на главной" defaultValue={project?.homeOrder ?? 0} type="number" />
        <label className="flex items-center gap-3 text-sm sm:col-span-2"><input type="checkbox" name="showOnHome" defaultChecked={project?.showOnHome ?? false} className="size-4 accent-neutral-950" />Показывать на главной после публикации</label>
        <p className="text-xs text-neutral-500 sm:col-span-2">Добавление изображений, обложки и галереи — отдельный следующий подэтап. Пока проект без обложки не может быть опубликован.</p>
      </CardContent></Card>
      <div className="flex justify-end"><Button disabled={pending} type="submit">{pending ? 'Сохранение…' : 'Сохранить проект'}</Button></div>
    </form>
  )
}
