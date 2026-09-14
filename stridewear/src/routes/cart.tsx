import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCart } from '#/hooks/use-cart'
import { useAuth } from '#/lib/auth'
import { calculateCart, formatPrice } from '#/lib/cart-utils'
import { CartItem } from '#/components/ui/cart-item'
import { CouponInput } from '#/components/ui/coupon-input'
import { Skeleton } from '#/components/ui/skeleton'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const { items, isLoading, itemCount } = useCart()
  const { user } = useAuth()
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    couponId: string
  } | null>(null)

  const calculation = calculateCart(items, appliedCoupon?.discount ?? 0)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl uppercase text-brand-black">
          Your Cart
        </h1>
        <p className="mt-4 text-brand-gray-400">
          Please sign in to view your cart.
        </p>
        <Link
          to="/signin"
          className="mt-6 inline-block rounded-full bg-brand-black px-6 py-2 text-xs font-bold uppercase tracking-widest text-brand-white hover:bg-brand-black-light"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl uppercase text-brand-black">
          Your Cart
        </h1>
        <p className="mt-4 text-brand-gray-400">
          Your cart is empty.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-full bg-brand-black px-6 py-2 text-xs font-bold uppercase tracking-widest text-brand-white hover:bg-brand-black-light"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl uppercase text-brand-black">
        Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="divide-y divide-brand-gray-100">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-6 border-t border-brand-gray-100 pt-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-gray-400">Subtotal</span>
            <span className="text-sm font-semibold text-brand-black">
              {formatPrice(calculation.subtotal)}
            </span>
          </div>

          <CouponInput
            subtotal={calculation.subtotal}
            appliedCoupon={appliedCoupon}
            onApply={(discount, couponId, code) =>
              setAppliedCoupon({ code, discount, couponId })
            }
            onRemove={() => setAppliedCoupon(null)}
          />

          {calculation.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">Discount</span>
              <span className="text-sm font-semibold text-green-600">
                −{formatPrice(calculation.discount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-gray-400">Tax (8%)</span>
            <span className="text-sm font-semibold text-brand-black">
              {formatPrice(calculation.tax)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-gray-400">Shipping</span>
            <span className="text-sm font-semibold text-brand-black">
              {calculation.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(calculation.shipping)
              )}
            </span>
          </div>
          {calculation.shipping > 0 && (
            <p className="text-xs text-brand-gray-400">
              Free shipping on orders over $100
            </p>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-brand-gray-100 pt-2">
            <span className="text-base font-bold text-brand-black">Total</span>
            <span className="text-lg font-bold text-brand-black">
              {formatPrice(calculation.total)}
            </span>
          </div>
        </div>

        <Link
          to="/checkout"
          className="mt-4 block w-full rounded-full bg-brand-lime px-6 py-3 text-center text-sm font-bold uppercase tracking-widest text-brand-black transition-colors hover:bg-brand-lime-dark"
        >
          Proceed to Checkout
        </Link>

        <Link
          to="/products"
          className="mt-3 block text-center text-xs font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
