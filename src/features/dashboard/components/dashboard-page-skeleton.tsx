import { Skeleton } from '@/components/ui/skeleton'

type Props = { variant?: 'overview' | 'table' | 'form' }

/** Screen-specific fallbacks within the authenticated DashboardShell. No second fake sidebar. */
export function DashboardPageSkeleton({ variant = 'table' }: Props) {
  const line = 'bg-dashboard-input border border-dashboard-border'

  return (
    <div
      className='mx-auto w-full max-w-7xl animate-pulse space-y-7 text-brand-milk'
      role='status'
      aria-label='Загрузка раздела'
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-3'>
          <Skeleton className={`${line} h-9 w-48 rounded-md`} />
          <Skeleton className={`${line} h-4 w-72 max-w-[65vw] rounded-md`} />
        </div>
        {variant !== 'overview' && <Skeleton className={`${line} h-9 w-40 rounded-md`} />}
      </div>

      {variant === 'overview' ? (
        <div className='grid gap-4 sm:grid-cols-3'>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className={`${line} h-36 rounded-xl`} />
          ))}
        </div>
      ) : variant === 'table' ? (
        <>
          <Skeleton className={`${line} h-9 w-80 max-w-full rounded-md`} />
          <div className='overflow-hidden rounded-lg border border-dashboard-border bg-dashboard-background'>
            <div className='grid grid-cols-4 gap-5 border-b border-dashboard-border bg-dashboard-input/50 px-5 py-4'>
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} className='h-3 rounded-sm bg-dashboard-border' />)}
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className='flex items-center gap-5 border-b border-dashboard-border/70 px-5 py-5 last:border-0'>
                <Skeleton className='h-5 w-2/5 rounded-sm bg-dashboard-input' />
                <Skeleton className='h-5 w-1/5 rounded-sm bg-dashboard-input' />
                <Skeleton className='h-5 w-1/5 rounded-sm bg-dashboard-input' />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_270px]'>
          <div className='space-y-6'>
            <div className='space-y-6 rounded-lg border border-dashboard-border bg-dashboard-background p-6'>
              <Skeleton className={`${line} h-6 w-40 rounded-sm`} />
              <div className='grid gap-5 sm:grid-cols-2'>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div className='space-y-2' key={i}>
                    <Skeleton className='h-4 w-28 rounded-sm bg-dashboard-input' />
                    <Skeleton className={`${line} h-10 w-full rounded-md`} />
                  </div>
                ))}
              </div>
              <Skeleton className={`${line} h-32 w-full rounded-md`} />
            </div>
          </div>
          <Skeleton className={`${line} hidden h-72 rounded-lg xl:block`} />
        </div>
      )}
      <span className='sr-only'>Подождите, загружаем данные.</span>
    </div>
  )
}
