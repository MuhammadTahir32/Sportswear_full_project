import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/cn'
import { getImageUrl } from '#/lib/image'
import { StarRating } from '#/components/ui/star-rating'
import type { ProductListItem } from '#/hooks/use-products'

type ProductCardProps = {
  product: ProductListItem
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mainImage = product.product_images
    .sort((a, b) => a.position - b.position)[0]

  const imageUrl = mainImage ? getImageUrl(mainImage.storage_path) : null

  const displayPrice = product.sale_price ?? product.base_price
  const hasDiscount = product.sale_price !== null && product.sale_price < product.base_price

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className={cn(
        'group flex flex-col gap-3',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-gray-400">
            No Image
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded bg-brand-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-white">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {product.category && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-gray-400">
            {product.category.name}
          </span>
        )}

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-brand-black">
          {product.name}
        </h3>

        <StarRating rating={Math.round(product.avg_rating)} count={0} size="sm" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-brand-black-light">
            ${displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-brand-gray-400 line-through">
              ${product.base_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
