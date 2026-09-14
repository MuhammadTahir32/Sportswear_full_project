import { Link } from '@tanstack/react-router'
import { useCategories } from '#/hooks/use-products'
import { cn } from '#/lib/cn'

type CategorySidebarProps = {
  activeCategory?: string
  className?: string
}

export function CategorySidebar({ activeCategory, className }: CategorySidebarProps) {
  const { data: categories, isLoading } = useCategories()

  return (
    <aside className={cn('w-full shrink-0', className)}>
      <h2 className="mb-4 font-display text-sm uppercase tracking-widest text-brand-black">
        Categories
      </h2>

      {isLoading ? (
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-4 w-24 animate-pulse rounded bg-brand-gray-100" />
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              to="/products"
              search={{ page: 1, sort: 'newest' }}
              className={cn(
                'block rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
                !activeCategory
                  ? 'bg-brand-black text-brand-white'
                  : 'text-brand-gray-400 hover:bg-brand-gray-50 hover:text-brand-black',
              )}
            >
              All Products
            </Link>
          </li>
          {categories?.map((cat) => (
            <li key={cat.id}>
              <Link
                to="/products"
                search={{ page: 1, sort: 'newest', category: cat.slug }}
                className={cn(
                  'block rounded px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
                  activeCategory === cat.slug
                    ? 'bg-brand-black text-brand-white'
                    : 'text-brand-gray-400 hover:bg-brand-gray-50 hover:text-brand-black',
                )}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
