import type { ProjectTableRow } from './types'

export const PROJECTS_PAGE_SIZE = 10
export function projectSearchText(item: ProjectTableRow): string {
  return [item.title, item.slug, item.location, ...item.tags].filter(Boolean).join(' ')
}
