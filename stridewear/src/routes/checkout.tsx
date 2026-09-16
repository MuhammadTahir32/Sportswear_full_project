import { useState } from 'react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useCart } from '#/hooks/use-cart'
import { ProtectedRoute } from '#/components/auth/protected-route'
import { CheckoutLayout } from '#/components/checkout/checkout-layout'
import { AddressStep } from '#/components/checkout/address-step'
import { ShippingStep } from '#/components/checkout/shipping-step'
import { ReviewStep } from '#/components/checkout/review-step'
import { usePlaceOrder } from '#/hooks/use-place-order'
import { calculateCart } from '#/lib/cart-utils'
import type { Address } from '#/hooks/use-addresses'
import type { ShippingMethod } from '#/components/checkout/shipping-step'
import type { Coupon } from '#/hooks/use-coupon'

export const Route = createFileRoute('/checkout')({
  component: CheckoutWrapper,
})

function CheckoutWrapper() {
  return (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  )
}

function Checkout() {
  const { items, isLoading: cartLoading, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null)
  const [appliedCoupon] = useState<Coupon | null>(null)
  const [couponDiscount] = useState(0)
  const [orderError, setOrderError] = useState<string | null>(null)
  const placeOrder = usePlaceOrder()

  const calculation = calculateCart(items, couponDiscount)

  if (cartLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-gray-50">
        <div className="h-8 w-8 animate-spin border-2 border-brand-black border-t-transparent" />
      </main>
    )
  }

  if (items.length === 0) {
    return <Navigate to="/cart" />
  }

  function handleAddressContinue() {
    if (selectedAddress) {
      setStep(2)
    }
  }

  function handleShippingContinue() {
    if (selectedShipping) {
      setStep(3)
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddress || !selectedShipping) return

    setOrderError(null)

    try {
      await placeOrder.mutateAsync({
        items,
        address: selectedAddress,
        shipping: selectedShipping,
        subtotal: calculation.subtotal,
        tax: calculation.tax,
        discount: calculation.discount,
        total: calculation.total,
        coupon: appliedCoupon,
      })

      await clearCart.mutateAsync()
      setStep(4)
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : 'Failed to place order. Please try again.',
      )
    }
  }

  return (
    <CheckoutLayout
      currentStep={step}
      onContinue={
        step === 1
          ? handleAddressContinue
          : step === 2
            ? handleShippingContinue
            : step === 3
              ? handlePlaceOrder
              : undefined
      }
      continueLabel={
        step === 1
          ? 'Continue to Shipping'
          : step === 2
            ? 'Continue to Review'
            : step === 3
              ? 'Place Order'
              : undefined
      }
      isContinueDisabled={
        (step === 1 && !selectedAddress) ||
        (step === 2 && !selectedShipping) ||
        (step === 3 && placeOrder.isPending)
      }
      isContinueLoading={step === 3 && placeOrder.isPending}
    >
      {step === 1 && (
        <AddressStep
          selectedAddress={selectedAddress}
          onSelect={setSelectedAddress}
        />
      )}

      {step === 2 && (
        <ShippingStep
          selectedShipping={selectedShipping}
          onSelect={setSelectedShipping}
          subtotal={calculation.subtotal}
        />
      )}

      {step === 3 && selectedAddress && selectedShipping && (
        <>
          {orderError && (
            <div className="mb-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {orderError}
            </div>
          )}
          <ReviewStep
            items={items}
            address={selectedAddress}
            shipping={selectedShipping}
            subtotal={calculation.subtotal}
            tax={calculation.tax}
            shippingCost={calculation.shipping}
            discount={calculation.discount}
            total={calculation.total}
          />
        </>
      )}

      {step === 4 && (
        <div>
          <h2 className="font-display text-2xl uppercase text-brand-black">
            Order Confirmed
          </h2>
          <p className="mt-1 text-sm text-brand-gray-400">
            Coming in Task 4.11
          </p>
        </div>
      )}
    </CheckoutLayout>
  )
}
