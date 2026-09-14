import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$slug')({
  component: ProductDetailPlaceholder,
})

function ProductDetailPlaceholder() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center">
      <p className="font-display text-2xl uppercase text-brand-black">
        Product Detail — Coming Soon
      </p>
    </div>
  )
}
