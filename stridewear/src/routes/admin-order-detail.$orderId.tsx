import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAdminOrder, type OrderStatus } from '#/hooks/use-admin-orders'
import { useUpdateOrderStatus } from '#/hooks/use-update-order-status'
import { AdminRoute } from '#/components/auth/admin-route'
import { formatPrice } from '#/lib/cart-utils'
import { getImageUrl } from '#/lib/image'

export const Route = createFileRoute('/admin-order-detail/$orderId')({
  component: () => (
    <AdminRoute>
      <AdminOrderDetail />
    </AdminRoute>
  ),
})

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

const STATUS_TIMELINE: Record<string, string[]> = {
  pending: ['pending'],
  paid: ['pending', 'paid'],
  processing: ['pending', 'paid', 'processing'],
  shipped: ['pending', 'paid', 'processing', 'shipped'],
  delivered: ['pending', 'paid', 'processing', 'shipped', 'delivered'],
  cancelled: ['pending', 'cancelled'],
  refunded: ['pending', 'paid', 'refunded'],
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

function AdminOrderDetail() {
  const { orderId } = Route.useParams()
  const { data: order, isLoading } = useAdminOrder(orderId)
  const updateStatus = useUpdateOrderStatus()
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updateError, setUpdateError] = useState<string | null>(null)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-brand-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-sm border border-brand-gray-100 bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-brand-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="font-display text-3xl uppercase text-brand-black">
            Order Not Found
          </h1>
          <p className="mt-2 text-sm text-brand-gray-400">
            This order doesn&apos;t exist or you don&apos;t have access.
          </p>
          <Link
            to="/admin-orders"
            className="mt-6 inline-block bg-brand-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-black hover:bg-brand-lime-dark"
          >
            Back to Orders
          </Link>
        </div>
      </main>
    )
  }

  const shippingAddress = order.shipping_address as {
    full_name: string
    line1: string
    line2?: string
    city: string
    state: string
    postal_code: string
    country: string
    phone: string
  }

  const timelineSteps = STATUS_TIMELINE[order.status] ?? ['pending']
  const allSteps = ['pending', 'paid', 'processing', 'shipped', 'delivered']

  const orderDate = new Date(order.created_at)

  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          to="/admin-orders"
          className="mb-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-brand-gray-400 hover:text-brand-black"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Orders
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl uppercase text-brand-black">
              Order Details
            </h1>
            <p className="mt-1 font-mono text-sm text-brand-gray-400">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <span
            className={`flex-shrink-0 px-3 py-1 text-xs font-bold uppercase ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-800'}`}
          >
            {order.status}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <p className="text-sm text-brand-gray-400">
            Placed on{' '}
            {orderDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {' at '}
            {orderDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {order.profiles?.full_name && (
            <p className="text-sm text-brand-gray-700">
              by <span className="font-semibold">{order.profiles.full_name}</span>
            </p>
          )}
        </div>

        <div className="mt-10 space-y-6">
          <div className="rounded-sm border border-brand-gray-100 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
              Order Status
            </h2>
            <div className="mt-4 flex items-center gap-2">
              {allSteps.map((step, i) => {
                const isActive = timelineSteps.includes(step)
                const isCurrent = step === order.status

                return (
                  <div key={step} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center text-xs font-bold ${
                          isActive
                            ? 'bg-brand-black text-brand-white'
                            : 'bg-brand-gray-100 text-brand-gray-400'
                        } ${isCurrent ? 'ring-2 ring-brand-lime ring-offset-2' : ''}`}
                      >
                        {isActive ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span className="mt-1 text-[10px] font-semibold uppercase text-brand-gray-400">
                        {step}
                      </span>
                    </div>
                    {i < allSteps.length - 1 && (
                      <div
                        className={`mb-5 h-px w-8 ${
                          timelineSteps.includes(allSteps[i + 1])
                            ? 'bg-brand-black'
                            : 'bg-brand-gray-100'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-sm border border-brand-gray-100 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
              Update Order Status
            </h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full border border-brand-gray-100 bg-white px-4 py-2.5 text-sm text-brand-black focus:border-brand-black focus:outline-none"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                  Tracking Number (optional)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full border border-brand-gray-100 bg-white px-4 py-2.5 text-sm text-brand-black placeholder-brand-gray-400 focus:border-brand-black focus:outline-none"
                />
              </div>
              <button
                onClick={async () => {
                  setUpdateError(null)
                  try {
                    await updateStatus.mutateAsync({
                      orderId: order.id,
                      status: newStatus,
                      trackingNumber: trackingNumber || undefined,
                    })
                  } catch (err) {
                    setUpdateError(err instanceof Error ? err.message : 'Failed to update')
                  }
                }}
                disabled={updateStatus.isPending || newStatus === order.status}
                className="bg-brand-black px-6 py-2.5 text-sm font-semibold uppercase tracking-wider text-brand-white hover:bg-brand-black-light disabled:bg-brand-gray-400"
              >
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </button>
            </div>
            {updateError && (
              <p className="mt-3 text-sm text-red-600">{updateError}</p>
            )}
            {updateStatus.isSuccess && (
              <p className="mt-3 text-sm text-green-600">Order status updated successfully</p>
            )}
          </div>

          <div className="rounded-sm border border-brand-gray-100 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
              Customer & Shipping
            </h2>
            <div className="mt-3">
              <p className="text-sm font-semibold text-brand-black">
                {shippingAddress.full_name}
              </p>
              <p className="text-sm text-brand-gray-700">
                {shippingAddress.line1}
                {shippingAddress.line2 ? `, ${shippingAddress.line2}` : ''}
              </p>
              <p className="text-sm text-brand-gray-700">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
              </p>
              <p className="text-sm text-brand-gray-700">{shippingAddress.country}</p>
              <p className="mt-1 text-sm text-brand-gray-400">{shippingAddress.phone}</p>
            </div>
          </div>

          <div className="rounded-sm border border-brand-gray-100 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
              Order Items
            </h2>
            <div className="mt-4 space-y-4">
              {order.order_items.map((item) => {
                const image = item.product_variants?.products?.product_images?.[0]

                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-20 w-20 flex-shrink-0 bg-brand-gray-50">
                      {image && (
                        <img
                          src={getImageUrl(image.storage_path)}
                          alt={item.product_variants?.products?.name ?? ''}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-black">
                        {item.product_variants?.products?.name}
                      </p>
                      <p className="text-xs text-brand-gray-400">
                        {item.product_variants?.color} / {item.product_variants?.size}
                      </p>
                      <p className="text-xs text-brand-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-brand-black">
                      {formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-sm border border-brand-gray-100 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
              Payment
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-sm bg-brand-gray-50 px-2 py-0.5 text-xs font-semibold text-brand-black">
                COD
              </span>
              <span className="text-sm text-brand-gray-700">Cash on Delivery</span>
            </div>
            {order.tracking_number && (
              <div className="mt-3 border-t border-brand-gray-100 pt-3">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
                  Tracking Number
                </p>
                <p className="mt-1 font-mono text-sm text-brand-black">
                  {order.tracking_number}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 rounded-sm border border-brand-gray-100 bg-white p-6">
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray-400">Subtotal</span>
              <span className="text-brand-black">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray-400">Discount</span>
                <span className="text-green-600">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray-400">Tax (8%)</span>
              <span className="text-brand-black">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-gray-400">Shipping</span>
              <span className="text-brand-black">
                {order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-brand-gray-100 pt-2 text-sm font-bold">
              <span className="uppercase text-brand-black">Total</span>
              <span className="text-brand-black">{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.order_status_history.length > 0 && (
            <div className="rounded-sm border border-brand-gray-100 bg-white p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-gray-400">
                Status History
              </h2>
              <div className="mt-4 space-y-3">
                {[...order.order_status_history].reverse().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 flex-shrink-0 rounded-full bg-brand-black" />
                      <span className="text-sm font-semibold capitalize text-brand-black">
                        {entry.status}
                      </span>
                    </div>
                    <span className="text-xs text-brand-gray-400">
                      {new Date(entry.changed_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
