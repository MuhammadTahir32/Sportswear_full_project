import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useProductBySlug } from '#/hooks/use-products'
import { getImageUrl } from '#/lib/image'
import { StarRating } from '#/components/ui/star-rating'
import { Skeleton } from '#/components/ui/skeleton'
import { VariantSelector } from '#/components/ui/variant-selector'
import { ReviewList } from '#/components/ui/review-list'
import { SizeGuide } from '#/components/ui/size-guide'
import type { Tables } from '#/lib/database.types'

export const Route = createFileRoute('/products/$slug')({
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { slug } = Route.useParams()
  const { data: product, isLoading, error } = useProductBySlug(slug)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<Tables<'product_variants'> | null>(null)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl uppercase text-brand-black">
          Product Not Found
        </h1>
        <p className="mt-2 text-brand-gray-400">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-brand-black px-6 py-2 text-xs font-bold uppercase tracking-widest text-brand-white hover:bg-brand-black-light"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  const images = product.product_images.sort((a, b) => a.position - b.position)
  const baseDisplayPrice = product.sale_price ?? product.base_price
  const displayPrice = selectedVariant?.price_override ?? baseDisplayPrice
  const hasDiscount = selectedVariant?.price_override
    ? selectedVariant.price_override < product.base_price
    : product.sale_price !== null && product.sale_price < product.base_price
  const totalStock = product.product_variants.reduce((sum, v) => sum + v.stock_qty, 0)
  const uniqueSizes = [...new Set(product.product_variants.map((v) => v.size))]
  const uniqueColors = [...new Set(product.product_variants.map((v) => v.color))]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 text-xs text-brand-gray-400">
        <Link to="/" className="hover:text-brand-black">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-brand-black">Shop</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              to="/products"
              search={{ page: 1, sort: 'newest', category: product.category.slug }}
              className="hover:text-brand-black"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-brand-black">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-brand-gray-50">
            {images[selectedImageIndex] ? (
              <img
                src={getImageUrl(images[selectedImageIndex].storage_path)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-brand-gray-400">
                No Image
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={img.storage_path}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === index
                      ? 'border-brand-black'
                      : 'border-transparent hover:border-brand-gray-100'
                  }`}
                >
                  <img
                    src={getImageUrl(img.storage_path)}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-gray-400">
              {product.category.name}
            </span>
          )}

          <h1 className="font-display text-3xl uppercase text-brand-black lg:text-4xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(product.avg_rating)} size="md" />
            <span className="text-sm text-brand-gray-400">
              ({product.avg_rating.toFixed(1)})
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-brand-black">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-brand-gray-400 line-through">
                ${product.base_price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${totalStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-brand-gray-400">
              {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex gap-4 text-xs uppercase tracking-wider text-brand-gray-400">
            <span>{product.gender}</span>
            <span>•</span>
            <span>{uniqueSizes.length} sizes</span>
            <span>•</span>
            <span>{uniqueColors.length} colors</span>
          </div>

          {product.description && (
            <p className="mt-2 text-sm leading-relaxed text-brand-gray-700">
              {product.description}
            </p>
          )}

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-black">
                Select Options
              </span>
              <SizeGuide gender={product.gender} />
            </div>
            <VariantSelector
              variants={product.product_variants}
              onVariantSelect={setSelectedVariant}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-brand-gray-100 pt-8">
        <h2 className="mb-6 font-display text-2xl uppercase text-brand-black">
          Reviews
        </h2>
        <ReviewList productId={product.id} />
      </div>
    </div>
  )
}
