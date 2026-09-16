import { createFileRoute, Link } from '@tanstack/react-router'
import { useOrders } from '#/hooks/use-orders'
import { formatPrice } from '#/lib/cart-utils'
import { getImageUrl } from '#/lib/image'

export const Route = createFileRoute('/orders/')({
  component: OrdersList,
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

function OrdersList() {
  const { data: orders, isLoading } = useOrders()

  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-display text-4xl uppercase text-brand-black">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-brand-gray-400">
          View your order history and tracking
        </p>

        {isLoading && (
          <div className="mt-10 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-sm border border-brand-gray-100 bg-white"
              />
            ))}
          </div>
        )}

        {!isLoading && orders && orders.length === 0 && (
          <div className="mt-10 rounded-sm border border-dashed border-brand-gray-100 bg-white p-12 text-center">
            <p className="font-display text-lg uppercase text-brand-gray-400">
              No orders yet
            </p>
            <p className="mt-2 text-sm text-brand-gray-400">
              Start shopping to see your orders here
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-brand-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-black hover:bg-brand-lime-dark"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const firstItem = order.order_items[0]
              const image = firstItem?.product_variants?.products?.product_images?.[0]
              const itemCount = order.order_items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              )
              const statusClass =
                STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-800'

              return (
                <Link
                  key={order.id}
                  to="/orders/$orderId"
                  params={{ orderId: order.id }}
                  className="block rounded-sm border border-brand-gray-100 bg-white p-5 transition-colors hover:border-brand-gray-400"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 flex-shrink-0 bg-brand-gray-50">
                      {image && (
                        <img
                          src={getImageUrl(image.storage_path)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-xs font-semibold text-brand-black">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-brand-gray-400">
                            {new Date(order.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </p>
                        </div>
                        <span
                          className={`flex-shrink-0 px-2.5 py-0.5 text-xs font-bold uppercase ${statusClass}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-brand-gray-400">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          {order.order_items.length > 1 && (
                            <span className="text-brand-gray-400">
                              {' '}
                              ({order.order_items.length} products)
                            </span>
                          )}
                        </p>
                        <p className="text-sm font-bold text-brand-black">
                          {formatPrice(order.total)}
                        </p>
                      </div>

                      {order.order_items.slice(0, 3).map((item) => (
                        <p
                          key={item.id}
                          className="mt-1 truncate text-xs text-brand-gray-400"
                        >
                          {item.product_variants?.products?.name} x{item.quantity}
                        </p>
                      ))}
                      {order.order_items.length > 3 && (
                        <p className="mt-1 text-xs text-brand-gray-400">
                          +{order.order_items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
