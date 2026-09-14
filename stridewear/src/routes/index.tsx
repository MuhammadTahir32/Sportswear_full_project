import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '#/lib/auth'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { user } = useAuth()

  const error = useMemo(() => {
    const hash = window.location.hash
    if (!hash || !hash.includes('error')) return null

    const params = new URLSearchParams(hash.substring(1))
    const description = params.get('error_description')
    return description ? decodeURIComponent(description) : 'Something went wrong.'
  }, [])

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <span className="inline-block bg-brand-lime px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-black">
            StrideWear
          </span>
          <h1 className="mt-6 font-display text-3xl uppercase text-brand-black">
            Link Expired
          </h1>
          <p className="mt-4 text-brand-gray-400">{error}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signin">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black">
      <div className="text-center">
        <span className="inline-block bg-brand-lime px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-black">
          StrideWear
        </span>
        <h1 className="mt-8 font-display text-6xl uppercase text-brand-white leading-none">
          Your Next
        </h1>
        <h1 className="font-display text-6xl uppercase text-brand-lime leading-none">
          Move Starts
        </h1>
        <h1 className="font-display text-6xl uppercase text-brand-white leading-none">
          Here
        </h1>
        <p className="mt-6 max-w-md text-brand-gray-400">
          Performance sportswear engineered for athletes who push limits.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          {user ? (
            <Link to="/profile">
              <Button className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark">
                My Profile
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark">
                  Shop Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
