import { CARD_SHELL } from './SpotlightCard'
import { COVER_ASPECT } from './ProjectCover'

const BLOCK = 'animate-pulse rounded bg-white/5'

export function SkeletonBar({ className = '' }: { className?: string }) {
  return <div className={`${BLOCK} ${className}`} />
}

export function ProjectCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      data-skeleton-card="true"
      className={`${CARD_SHELL} ${className}`}
      aria-hidden="true"
    >
      <div className={`${COVER_ASPECT} animate-pulse bg-white/5`} />
      <div className="space-y-3 p-6">
        <SkeletonBar className="h-4 w-16 rounded-full" />
        <SkeletonBar className="h-5 w-2/3" />
        <SkeletonBar className="h-3 w-full" />
        <SkeletonBar className="h-3 w-4/5" />
        <div className="flex items-center justify-between pt-3">
          <div className="flex gap-2">
            <SkeletonBar className="h-4 w-14 rounded-full" />
            <SkeletonBar className="h-4 w-14 rounded-full" />
          </div>
          <SkeletonBar className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}

export function LabCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      data-skeleton-card="true"
      className={`${CARD_SHELL} h-full p-6 ${className}`}
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonBar className="h-8 w-8 rounded-lg" />
          <SkeletonBar className="h-5 w-14 rounded-full" />
        </div>
        <SkeletonBar className="h-5 w-14 rounded-full" />
      </div>
      <SkeletonBar className="mb-3 h-5 w-1/2" />
      <SkeletonBar className="mb-2 h-3 w-full" />
      <SkeletonBar className="mb-4 h-3 w-3/4" />
      <div className="mb-4 flex gap-2">
        <SkeletonBar className="h-4 w-14 rounded-full" />
        <SkeletonBar className="h-4 w-12 rounded-full" />
        <SkeletonBar className="h-4 w-16 rounded-full" />
      </div>
      <div className="flex gap-3">
        <SkeletonBar className="h-4 w-12" />
        <SkeletonBar className="h-4 w-12" />
      </div>
    </div>
  )
}

export function LogRowSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg-secondary p-5 ${className}`}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <div className="flex shrink-0 items-center gap-3 md:w-40">
          <SkeletonBar className="h-7 w-7 rounded-lg" />
          <SkeletonBar className="h-5 w-14 rounded-full" />
          <SkeletonBar className="h-3 w-16" />
        </div>
        <div className="flex-1 space-y-2">
          <SkeletonBar className="h-4 w-1/3" />
          <SkeletonBar className="h-3 w-full" />
          <SkeletonBar className="h-3 w-2/3" />
          <div className="flex gap-2 pt-1">
            <SkeletonBar className="h-4 w-12 rounded-full" />
            <SkeletonBar className="h-4 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
