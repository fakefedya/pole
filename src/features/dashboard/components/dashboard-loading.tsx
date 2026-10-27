import { DashboardPageSkeleton } from './dashboard-page-skeleton'

/** Legacy export kept for compatibility, no bright fake sidebar. */
export function DashboardLoading() {
  return <DashboardPageSkeleton variant='overview' />
}
