import { getImageUrl } from '#/lib/image'
import { useCart } from '#/hooks/use-cart'
import type { CartItemWithDetails } from '#/hooks/use-cart'

type CartItemProps = {
  item: CartItemWithDetails
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const variant = item.product_variants
  const product = variant.products
  const mainImage = product.product_images[0]
  const displayPrice = variant.price_override ?? product.sale_price ?? product.base_price
  const lineTotal = displayPrice * item.quantity

  return (
    <div className="flex gap-4 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-brand-gray-50">
        {mainImage ? (
          <img
            src={getImageUrl(mainImage.storage_path)}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-brand-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-brand-black">{product.name}</h3>
          <p className="text-xs text-brand-gray-400">
            {variant.color} / {variant.size}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
              disabled={updateQuantity.isPending}
              className="flex h-7 w-7 items-center justify-center rounded border border-brand-gray-100 text-brand-gray-400 hover:border-brand-black hover:text-brand-black"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-brand-black">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
              disabled={updateQuantity.isPending || item.quantity >= variant.stock_qty}
              className="flex h-7 w-7 items-center justify-center rounded border border-brand-gray-100 text-brand-gray-400 hover:border-brand-black hover:text-brand-black"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-brand-black">
              ${lineTotal.toFixed(2)}
            </span>
            <button
              onClick={() => removeItem.mutate(item.id)}
              disabled={removeItem.isPending}
              className="text-brand-gray-400 hover:text-red-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
