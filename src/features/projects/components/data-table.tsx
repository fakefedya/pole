'use client'
import { useMemo } from 'react'
import { DashboardDataTable } from '@/features/dashboard/components/dashboard-data-table'
import { projectColumns } from './columns'
import { projectSearchText, PROJECTS_PAGE_SIZE } from './data-table-features'
import type { ProjectTableRow } from './types'

export function ProjectsDataTable({ projects, canEdit }: { projects: ProjectTableRow[]; canEdit: boolean }) {
  const columns = useMemo(() => projectColumns(canEdit), [canEdit])
  return <DashboardDataTable
    rows={projects} columns={columns} searchText={projectSearchText}
    searchPlaceholder='Название, URL, локация или тег…'
    emptyMessage='Проекты не найдены' pageSize={PROJECTS_PAGE_SIZE}
  />
}
