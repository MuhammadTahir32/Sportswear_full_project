import { useAuth } from '#/lib/auth'
import { Navigate } from '@tanstack/react-router'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading } = useAuth()

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

  if (profile && profile.role !== 'admin' && profile.role !== 'super_admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray-50">
        <div className="text-center">
          <h1 className="font-display text-4xl uppercase text-brand-black">
            Access Denied
          </h1>
          <p className="mt-4 text-brand-gray-400">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
