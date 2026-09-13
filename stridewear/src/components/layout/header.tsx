import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth, signOut } from '#/lib/auth'

export function Header() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate({ to: '/signin' })
  }

  if (isLoading) return null

  return (
    <header className="flex items-center justify-between bg-brand-black px-6 py-4">
      <Link to="/" className="font-display text-xl uppercase text-brand-white">
        Stride<span className="text-brand-lime">Wear</span>
      </Link>

      <nav className="flex items-center gap-6">
        {user ? (
          <>
            <Link
              to="/profile"
              className="text-sm font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-white"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-white"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="text-sm font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-white"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-brand-lime px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-black hover:bg-brand-lime-dark"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
