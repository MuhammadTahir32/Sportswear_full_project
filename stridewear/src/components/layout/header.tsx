import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth, signOut } from '#/lib/auth'
import { useCategories } from '#/hooks/use-products'
import { useCart } from '#/hooks/use-cart'

export function Header() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const { itemCount } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate({ to: '/signin' })
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate({ to: '/products', search: { page: 1, sort: 'newest', search: value.trim() } })
      } else {
        navigate({ to: '/products', search: { page: 1, sort: 'newest' } })
      }
    }, 300)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (searchQuery.trim()) {
      navigate({ to: '/products', search: { page: 1, sort: 'newest', search: searchQuery.trim() } })
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="font-display text-2xl uppercase tracking-tight text-brand-black"
        >
          Stride<span className="text-brand-lime">Wear</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/products"
            className="text-xs font-bold uppercase tracking-widest text-brand-black hover:text-brand-lime-dark"
          >
            Shop
          </Link>
          {categories?.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              to="/products"
              search={{ page: 1, sort: 'newest' }}
              className="text-xs font-bold uppercase tracking-widest text-brand-gray-400 hover:text-brand-black"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search"
                className="w-40 rounded-full border border-brand-gray-100 bg-brand-gray-50 px-4 py-1.5 text-xs text-brand-black placeholder-brand-gray-400 focus:border-brand-lime focus:outline-none lg:w-56"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-400 hover:text-brand-black"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <Link
            to="/products"
            className="text-brand-gray-400 hover:text-brand-black sm:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {isLoading ? null : user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="text-brand-gray-400 hover:text-brand-black"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              <Link
                to="/cart"
                className="relative text-brand-gray-400 hover:text-brand-black"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-lime text-[9px] font-bold text-brand-black">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleSignOut}
                className="hidden text-xs font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-black lg:block"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signin"
                className="text-xs font-semibold uppercase tracking-wider text-brand-gray-400 hover:text-brand-black"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-white hover:bg-brand-black-light"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
