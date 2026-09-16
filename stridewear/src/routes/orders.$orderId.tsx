import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailPlaceholder,
})

function OrderDetailPlaceholder() {
  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-brand-gray-400">Loading order details...</p>
      </div>
    </main>
  )
}
