import { useState } from 'react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useCart } from '#/hooks/use-cart'
import { ProtectedRoute } from '#/components/auth/protected-route'
import { CheckoutLayout } from '#/components/checkout/checkout-layout'
import { AddressStep } from '#/components/checkout/address-step'
import { ShippingStep } from '#/components/checkout/shipping-step'
import { calculateCart } from '#/lib/cart-utils'
import type { Address } from '#/hooks/use-addresses'
import type { ShippingMethod } from '#/components/checkout/shipping-step'

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
  const { items, isLoading: cartLoading } = useCart()
  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null)

  const calculation = calculateCart(items)

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

  return (
    <CheckoutLayout
      currentStep={step}
      onContinue={
        step === 1
          ? handleAddressContinue
          : step === 2
            ? handleShippingContinue
            : undefined
      }
      continueLabel={
        step === 1
          ? 'Continue to Shipping'
          : step === 2
            ? 'Continue to Review'
            : undefined
      }
      isContinueDisabled={
        (step === 1 && !selectedAddress) ||
        (step === 2 && !selectedShipping)
      }
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

      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl uppercase text-brand-black">
            Review Order
          </h2>
          <p className="mt-1 text-sm text-brand-gray-400">
            Coming in Task 4.9
          </p>
        </div>
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
