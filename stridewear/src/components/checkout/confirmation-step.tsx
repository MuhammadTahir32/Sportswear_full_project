import { Link } from '@tanstack/react-router'
import { formatPrice } from '#/lib/cart-utils'

type ConfirmationStepProps = {
  orderId: string
  total: number
}

export function ConfirmationStep({ orderId, total }: ConfirmationStepProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <h2 className="mt-6 font-display text-3xl uppercase text-brand-black">
        Order Confirmed
      </h2>
      <p className="mt-2 text-sm text-brand-gray-400">
        Thank you for your purchase!
      </p>

      <div className="mt-8 rounded-sm border border-brand-gray-100 bg-white p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Order ID
          </span>
          <span className="font-mono text-sm font-semibold text-brand-black">
            {orderId.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-brand-gray-100 pt-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Total
          </span>
          <span className="text-sm font-bold text-brand-black">
            {formatPrice(total)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-brand-gray-100 pt-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
            Payment
          </span>
          <span className="rounded-sm bg-brand-gray-50 px-2 py-0.5 text-xs font-semibold text-brand-black">
            COD
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-sm bg-brand-gray-50 p-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gray-700">
          What happens next?
        </h3>
        <ul className="mt-2 space-y-1.5 text-left text-sm text-brand-gray-400">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-black">1.</span>
            We will process your order within 24 hours
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-black">2.</span>
            You will receive a confirmation email shortly
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-black">3.</span>
            Pay {formatPrice(total)} in cash when your order arrives
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/products"
          className="inline-flex w-full items-center justify-center bg-brand-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-black transition-colors hover:bg-brand-lime-dark sm:w-auto"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center border border-brand-black bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-black transition-colors hover:bg-brand-black hover:text-brand-white sm:w-auto"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
