import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useLegacyTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type LegacyColumnDef,
} from '@tanstack/react-table/legacy'
import { flexRender, type SortingState } from '@tanstack/react-table'
import { useAdminOrders, type AdminOrderWithDetails, type OrderStatus } from '#/hooks/use-admin-orders'
import { AdminRoute } from '#/components/auth/admin-route'
import { formatPrice } from '#/lib/cart-utils'

export const Route = createFileRoute('/admin-orders')({
  component: () => (
    <AdminRoute>
      <AdminOrdersList />
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

const STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

function AdminOrdersList() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }])

  const sortField = sorting[0]?.id as 'created_at' | 'total' | 'status' ?? 'created_at'
  const sortDir = sorting[0]?.desc ? 'desc' : 'asc'

  const { data: orders, isLoading } = useAdminOrders({
    status: statusFilter,
    search,
    sortBy: sortField,
    sortDirection: sortDir,
  })

  const columns: LegacyColumnDef<AdminOrderWithDetails, any>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-brand-black">
          #{row.original.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorFn: (row) => row.profiles?.full_name ?? 'Unknown',
      id: 'customer',
      header: 'Customer',
      cell: ({ getValue }) => (
        <span className="text-sm text-brand-gray-700">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => {
        const d = new Date(row.original.created_at)
        return (
          <span className="text-sm text-brand-gray-700">
            {d.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            {' '}
            <span className="text-brand-gray-400">
              {d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </span>
        )
      },
    },
    {
      accessorFn: (row) => row.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0),
      id: 'items',
      header: 'Items',
      cell: ({ getValue }) => (
        <span className="text-sm text-brand-gray-700">{getValue() as number}</span>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <span className="text-sm font-bold text-brand-black">
          {formatPrice(row.original.total)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusClass = STATUS_STYLES[row.original.status] ?? 'bg-gray-100 text-gray-800'
        return (
          <span className={`inline-block px-2.5 py-0.5 text-xs font-bold uppercase ${statusClass}`}>
            {row.original.status}
          </span>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Link
          to="/admin-order-detail/$orderId"
          params={{ orderId: row.original.id }}
          className="text-xs font-semibold uppercase tracking-wider text-brand-black hover:text-brand-lime-dark"
        >
          View
        </Link>
      ),
    },
  ]

  const table = useLegacyTable({
    data: orders ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  })

  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl uppercase text-brand-black">
              Orders
            </h1>
            <p className="mt-2 text-sm text-brand-gray-400">
              Manage customer orders and fulfillment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-gray-400">
              {orders?.length ?? 0} total orders
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 border border-brand-gray-100 bg-white px-4 py-2.5 text-sm text-brand-black placeholder-brand-gray-400 focus:border-brand-black focus:outline-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="border border-brand-gray-100 bg-white px-4 py-2.5 text-sm text-brand-black focus:border-brand-black focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
            </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="mt-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-sm border border-brand-gray-100 bg-white"
              />
            ))}
          </div>
        )}

        {!isLoading && orders && orders.length === 0 && (
          <div className="mt-8 rounded-sm border border-dashed border-brand-gray-100 bg-white p-12 text-center">
            <p className="font-display text-lg uppercase text-brand-gray-400">
              No orders found
            </p>
            <p className="mt-2 text-sm text-brand-gray-400">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Orders will appear here once customers start placing them'}
            </p>
          </div>
        )}

        {!isLoading && orders && orders.length > 0 && (
          <div className="mt-8 overflow-hidden border border-brand-gray-100 bg-white">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-brand-gray-100 bg-brand-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-brand-gray-400"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-brand-gray-100 last:border-0 hover:bg-brand-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
