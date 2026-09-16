import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProtectedRoute } from '#/components/auth/protected-route'

export const Route = createFileRoute('/orders')({
  component: OrdersLayout,
})

function OrdersLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
