import { useState } from 'react'
import { cn } from '#/lib/cn'
import type { Tables } from '#/lib/database.types'

type ProductVariant = Tables<'product_variants'>

type VariantSelectorProps = {
  variants: ProductVariant[]
  onVariantSelect: (variant: ProductVariant | null) => void
  onAddToCart: (variantId: string) => void
  isAdding?: boolean
}

export function VariantSelector({ variants, onVariantSelect, onAddToCart, isAdding }: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const uniqueColors = [...new Set(variants.map((v) => v.color))]
  const availableSizes = selectedColor
    ? [...new Set(variants.filter((v) => v.color === selectedColor).map((v) => v.size))]
    : [...new Set(variants.map((v) => v.size))]

  const selectedVariant = selectedColor && selectedSize
    ? variants.find((v) => v.color === selectedColor && v.size === selectedSize) ?? null
    : null

  function handleColorSelect(color: string) {
    const newColor = selectedColor === color ? null : color
    setSelectedColor(newColor)
    setSelectedSize(null)
    onVariantSelect(null)
  }

  function handleSizeSelect(size: string) {
    const newSize = selectedSize === size ? null : size
    setSelectedSize(newSize)
    const variant = selectedColor && newSize
      ? variants.find((v) => v.color === selectedColor && v.size === newSize) ?? null
      : null
    onVariantSelect(variant)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-black">
            Color
          </span>
          {selectedColor && (
            <span className="text-xs text-brand-gray-400">{selectedColor}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map((color) => {
            const inStock = variants.some((v) => v.color === color && v.stock_qty > 0)
            return (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                disabled={!inStock}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all',
                  selectedColor === color
                    ? 'border-brand-black bg-brand-black text-brand-white'
                    : 'border-brand-gray-100 bg-white text-brand-black hover:border-brand-gray-400',
                  !inStock && 'cursor-not-allowed opacity-40',
                )}
              >
                {color}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-black">
            Size
          </span>
          {selectedSize && (
            <span className="text-xs text-brand-gray-400">{selectedSize}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const variant = variants.find((v) => v.color === selectedColor && v.size === size)
            const inStock = variant ? variant.stock_qty > 0 : false
            return (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                disabled={!inStock}
                className={cn(
                  'h-10 w-10 rounded-lg border-2 text-xs font-bold transition-all',
                  selectedSize === size
                    ? 'border-brand-black bg-brand-black text-brand-white'
                    : 'border-brand-gray-100 bg-white text-brand-black hover:border-brand-gray-400',
                  !inStock && 'cursor-not-allowed opacity-40 line-through',
                )}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {selectedVariant && (
        <div className="rounded-xl border border-brand-gray-100 bg-brand-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-gray-700">
              {selectedVariant.color} / {selectedVariant.size}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  selectedVariant.stock_qty > 0 ? 'bg-green-500' : 'bg-red-500',
                )}
              />
              <span className="text-xs text-brand-gray-400">
                {selectedVariant.stock_qty > 0
                  ? `${selectedVariant.stock_qty} in stock`
                  : 'Out of stock'}
              </span>
            </div>
          </div>
          {selectedVariant.price_override !== null && (
            <p className="mt-2 text-sm font-bold text-brand-black">
              ${selectedVariant.price_override.toFixed(2)}
            </p>
          )}
        </div>
      )}

      {selectedVariant && selectedVariant.stock_qty > 0 && (
        <button className="w-full rounded-full bg-brand-lime px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-black transition-colors hover:bg-brand-lime-dark">
          Add to Cart
        </button>
      )}

      {selectedVariant && selectedVariant.stock_qty === 0 && (
        <button disabled className="w-full cursor-not-allowed rounded-full bg-brand-gray-100 px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-gray-400">
          Out of Stock
        </button>
      )}
    </div>
  )
}
