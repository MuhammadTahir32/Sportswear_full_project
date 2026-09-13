import { useAuth } from '#/lib/auth'
import { Navigate } from '@tanstack/react-router'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray-50">
        <p className="font-display text-sm uppercase tracking-widest text-brand-gray-400">
          Loading...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" />
  }

  return <>{children}</>
}
