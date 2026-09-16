import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '#/hooks/use-cart'
import { calculateCart, formatPrice } from '#/lib/cart-utils'
import { Button } from '#/components/ui/button'
import { getImageUrl } from '#/lib/image'

const steps = [
  { number: 1, label: 'Address' },
  { number: 2, label: 'Shipping' },
  { number: 3, label: 'Review' },
  { number: 4, label: 'Confirm' },
]

type CheckoutLayoutProps = {
  currentStep: number
  children: ReactNode
  onContinue?: () => void
  continueLabel?: string
  isContinueDisabled?: boolean
  isContinueLoading?: boolean
}

export function CheckoutLayout({
  currentStep,
  children,
  onContinue,
  continueLabel = 'Continue',
  isContinueDisabled = false,
  isContinueLoading = false,
}: CheckoutLayoutProps) {
  const { items } = useCart()
  const calculation = calculateCart(items)

  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-4xl uppercase text-brand-black">
          Checkout
        </h1>

        <div className="mt-8 flex items-center gap-3">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center text-xs font-bold ${
                    currentStep >= step.number
                      ? 'bg-brand-black text-brand-white'
                      : 'bg-brand-gray-100 text-brand-gray-400'
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-sm font-semibold uppercase tracking-wider ${
                    currentStep >= step.number
                      ? 'text-brand-black'
                      : 'text-brand-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-px w-8 ${
                    currentStep > step.number
                      ? 'bg-brand-black'
                      : 'bg-brand-gray-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <div className="flex-1">{children}</div>

          {currentStep < 4 && (
            <div className="w-full lg:w-96">
              <div className="sticky top-24 rounded-sm border border-brand-gray-100 bg-white p-6">
                <h2 className="font-display text-lg uppercase text-brand-black">
                  Order Summary
                </h2>

                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => {
                    const price =
                      item.product_variants.price_override ??
                      item.product_variants.products.sale_price ??
                      item.product_variants.products.base_price
                    const image =
                      item.product_variants.products.product_images[0]

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3"
                      >
                        <div className="relative h-14 w-14 flex-shrink-0 bg-brand-gray-50">
                          {image && (
                            <img
                              src={getImageUrl(image.storage_path)}
                              alt={item.product_variants.products.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-brand-black text-[10px] font-bold text-brand-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-brand-black">
                            {item.product_variants.products.name}
                          </p>
                          <p className="text-xs text-brand-gray-400">
                            {item.product_variants.color} /{' '}
                            {item.product_variants.size}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-brand-black">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 space-y-2 border-t border-brand-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-400">Subtotal</span>
                    <span className="text-brand-black">
                      {formatPrice(calculation.subtotal)}
                    </span>
                  </div>
                  {calculation.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-gray-400">Discount</span>
                      <span className="text-green-600">
                        −{formatPrice(calculation.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-400">Tax (8%)</span>
                    <span className="text-brand-black">
                      {formatPrice(calculation.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-400">Shipping</span>
                    <span className="text-brand-black">
                      {calculation.shipping === 0
                        ? 'Free'
                        : formatPrice(calculation.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-brand-gray-100 pt-2 text-sm font-bold">
                    <span className="uppercase text-brand-black">Total</span>
                    <span className="text-brand-black">
                      {formatPrice(calculation.total)}
                    </span>
                  </div>
                </div>

                {onContinue && (
                  <Button
                    onClick={onContinue}
                    className="mt-6 w-full bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
                    disabled={isContinueDisabled}
                    isLoading={isContinueLoading}
                  >
                    {continueLabel}
                  </Button>
                )}

                <Link
                  to="/cart"
                  className="mt-3 block text-center text-xs font-semibold uppercase tracking-widest text-brand-gray-400 hover:text-brand-black"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
