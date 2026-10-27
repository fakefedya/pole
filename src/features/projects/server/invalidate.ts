import { revalidatePath, updateTag } from 'next/cache'

/** Call from Server Actions only; both caches are shared public data. */
export function invalidateProjectViews(): void {
  updateTag('featured-projects')
  updateTag('published-projects')
  revalidatePath('/')
  revalidatePath('/projects')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
}
