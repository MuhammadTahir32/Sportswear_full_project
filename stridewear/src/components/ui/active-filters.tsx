import { cn } from '#/lib/cn'

type ActiveFilter = {
  key: string
  label: string
  onRemove: () => void
}

type ActiveFiltersProps = {
  filters: ActiveFilter[]
  className?: string
}

export function ActiveFilters({ filters, className }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-xs font-semibold uppercase tracking-wider text-brand-gray-400">
        Active:
      </span>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={filter.onRemove}
          className="group flex items-center gap-1.5 rounded-full border border-brand-gray-100 bg-brand-gray-50 px-3 py-1 text-xs font-semibold text-brand-black transition-colors hover:border-brand-black"
        >
          {filter.label}
          <svg
            className="h-3 w-3 text-brand-gray-400 transition-colors group-hover:text-brand-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
    </div>
  )
}
