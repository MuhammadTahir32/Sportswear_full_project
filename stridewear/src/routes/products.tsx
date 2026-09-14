import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useProducts } from '#/hooks/use-products'
import { ProductCard } from '#/components/ui/product-card'
import { ProductCardSkeleton } from '#/components/ui/skeleton'
import { ActiveFilters } from '#/components/ui/active-filters'
import { CategorySidebar } from '#/components/layout/category-sidebar'
import { FilterSidebar } from '#/components/layout/filter-sidebar'
import { cn } from '#/lib/cn'

const productsSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).default('newest'),
  category: z.string().optional(),
  gender: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  search: z.string().optional(),
})

export const Route = createFileRoute('/products')({
  validateSearch: productsSearchSchema,
  component: ProductsPage,
})

function ProductsPage() {
  const { page, sort, category, gender, minPrice, maxPrice, search } = Route.useSearch()
  const navigate = useNavigate()

  const { data, isLoading, error } = useProducts({
    page,
    sort,
    categorySlug: category,
    gender,
    minPrice,
    maxPrice,
    search,
  })

  const sortOptions = [
    { value: 'newest' as const, label: 'Newest' },
    { value: 'price_asc' as const, label: 'Price: Low to High' },
    { value: 'price_desc' as const, label: 'Price: High to Low' },
    { value: 'rating' as const, label: 'Top Rated' },
  ]

  function buildSearch(updates: Record<string, unknown>) {
    return { page: 1, sort, category, gender, minPrice, maxPrice, search, ...updates }
  }

  function handlePageChange(newPage: number) {
    navigate({ to: '/products', search: { ...buildSearch({}), page: newPage } })
  }

  function handleSortChange(newSort: 'newest' | 'price_asc' | 'price_desc' | 'rating') {
    navigate({ to: '/products', search: buildSearch({ sort: newSort }) })
  }

  function handleGenderChange(newGender: string | undefined) {
    navigate({ to: '/products', search: buildSearch({ gender: newGender }) })
  }

  function handleMinPriceChange(value: string) {
    const num = value ? Number(value) : undefined
    navigate({ to: '/products', search: buildSearch({ minPrice: num }) })
  }

  function handleMaxPriceChange(value: string) {
    const num = value ? Number(value) : undefined
    navigate({ to: '/products', search: buildSearch({ maxPrice: num }) })
  }

  function handleClearAll() {
    navigate({ to: '/products', search: { page: 1, sort, category } })
  }

  function removeFilter(key: string) {
    const updates: Record<string, unknown> = { page: 1, sort, category }
    if (key === 'gender') updates.gender = undefined
    if (key === 'price') {
      updates.minPrice = undefined
      updates.maxPrice = undefined
    }
    navigate({ to: '/products', search: updates })
  }

  const activeFilters: { key: string; label: string }[] = []
  if (gender) activeFilters.push({ key: 'gender', label: gender })

  if (minPrice || maxPrice) {
    const presets: Record<string, string> = {
      '0-50': 'Under $50',
      '50-100': '$50 - $100',
      '100-150': '$100 - $150',
      '150-9999': '$150+',
    }
    const key = `${minPrice ?? 0}-${maxPrice ?? 0}`
    const label = presets[key] ?? `$${minPrice ?? 0} - $${maxPrice ?? '∞'}`
    activeFilters.push({ key: 'price', label })
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl uppercase text-brand-black">
          Something went wrong
        </h1>
        <p className="mt-2 text-brand-gray-400">
          Failed to load products. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase text-brand-black">
          {search ? `Search: "${search}"` : category ? category.replace(/-/g, ' ') : 'All Products'}
        </h1>
      </div>

      <ActiveFilters
        filters={activeFilters.map((f) => ({
          ...f,
          onRemove: () => removeFilter(f.key),
        }))}
        className="mb-6"
      />

      <div className="flex gap-8">
        <div className="hidden w-48 flex-col gap-8 lg:flex">
          <CategorySidebar activeCategory={category} />
          <FilterSidebar
            gender={gender}
            minPrice={minPrice?.toString()}
            maxPrice={maxPrice?.toString()}
            onGenderChange={handleGenderChange}
            onMinPriceChange={handleMinPriceChange}
            onMaxPriceChange={handleMaxPriceChange}
            onClearAll={handleClearAll}
          />
        </div>

        <div className="flex-1">
          <div className="mb-6 flex items-end justify-between">
            {data && (
              <p className="text-sm text-brand-gray-400">
                {data.total} product{data.total !== 1 ? 's' : ''}
              </p>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-gray-400">
                Sort by
              </span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as typeof sort)}
                className="rounded border border-brand-gray-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider text-brand-black focus:border-brand-lime focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : data && data.products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-2xl uppercase text-brand-black">
                No products found
              </p>
              <p className="mt-2 text-brand-gray-400">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {data?.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className={cn(
                      'rounded px-4 py-2 text-xs font-bold uppercase tracking-widest',
                      page <= 1
                        ? 'cursor-not-allowed text-brand-gray-100'
                        : 'text-brand-black hover:bg-brand-gray-50',
                    )}
                  >
                    Prev
                  </button>

                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          'h-9 w-9 rounded text-xs font-bold',
                          p === page
                            ? 'bg-brand-black text-brand-white'
                            : 'text-brand-black hover:bg-brand-gray-50',
                        )}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= data.totalPages}
                    className={cn(
                      'rounded px-4 py-2 text-xs font-bold uppercase tracking-widest',
                      page >= data.totalPages
                        ? 'cursor-not-allowed text-brand-gray-100'
                        : 'text-brand-black hover:bg-brand-gray-50',
                    )}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
