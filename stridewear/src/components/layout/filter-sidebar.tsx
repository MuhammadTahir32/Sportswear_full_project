import { cn } from '#/lib/cn'

type FilterSidebarProps = {
  gender?: string
  minPrice?: string
  maxPrice?: string
  onGenderChange: (gender: string | undefined) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onClearAll: () => void
  className?: string
}

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Kids' },
]

const PRICE_PRESETS = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: '$150+', min: 150, max: 9999 },
]

export function FilterSidebar({
  gender,
  minPrice,
  maxPrice,
  onGenderChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClearAll,
  className,
}: FilterSidebarProps) {
  const currentMin = minPrice ? Number(minPrice) : -1
  const currentMax = maxPrice ? Number(maxPrice) : -1

  let activePresetIndex = -1
  for (let i = 0; i < PRICE_PRESETS.length; i++) {
    const p = PRICE_PRESETS[i]
    if (currentMin === p.min && currentMax === p.max) {
      activePresetIndex = i
      break
    }
  }

  const hasActiveFilters = !!gender || activePresetIndex !== -1

  function handleGenderClick(value: string) {
    if (gender === value) {
      onGenderChange(undefined)
    } else {
      onGenderChange(value)
    }
  }

  function handlePresetClick(preset: (typeof PRICE_PRESETS)[number], index: number) {
    if (activePresetIndex === index) {
      onMinPriceChange('')
      onMaxPriceChange('')
    } else {
      onMinPriceChange(String(preset.min))
      onMaxPriceChange(String(preset.max))
    }
  }

  return (
    <aside className={cn('w-full shrink-0', className)}>
      {hasActiveFilters && (
        <div className="mb-4">
          <button
            onClick={onClearAll}
            className="w-full rounded border border-brand-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gray-400 transition-colors hover:border-brand-black hover:text-brand-black"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="mb-6">
        <h3 className="mb-3 font-display text-xs uppercase tracking-widest text-brand-black">
          Gender
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onGenderChange(undefined)}
            className={cn(
              'rounded px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider transition-colors',
              !gender
                ? 'bg-brand-black text-brand-white'
                : 'text-brand-gray-400 hover:bg-brand-gray-50 hover:text-brand-black',
            )}
          >
            All
          </button>
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleGenderClick(opt.value)}
              className={cn(
                'rounded px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider transition-colors',
                gender === opt.value
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-gray-400 hover:bg-brand-gray-50 hover:text-brand-black',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 font-display text-xs uppercase tracking-widest text-brand-black">
          Price Range
        </h3>
        <div className="flex flex-col gap-1">
          {PRICE_PRESETS.map((preset, index) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset, index)}
              className={cn(
                'rounded px-3 py-1.5 text-left text-xs font-semibold tracking-wider transition-colors',
                activePresetIndex === index
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-gray-400 hover:bg-brand-gray-50 hover:text-brand-black',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ''}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full rounded border border-brand-gray-100 bg-white px-2 py-1.5 text-xs text-brand-black placeholder-brand-gray-400 focus:border-brand-lime focus:outline-none"
          />
          <span className="text-brand-gray-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ''}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full rounded border border-brand-gray-100 bg-white px-2 py-1.5 text-xs text-brand-black placeholder-brand-gray-400 focus:border-brand-lime focus:outline-none"
          />
        </div>
      </div>
    </aside>
  )
}
