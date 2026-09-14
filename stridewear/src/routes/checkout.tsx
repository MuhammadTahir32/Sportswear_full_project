import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPlaceholder,
})

function CheckoutPlaceholder() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="font-display text-2xl uppercase text-brand-black">
        Checkout — Coming Soon
      </p>
    </div>
  )
}
