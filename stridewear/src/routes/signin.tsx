import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export const Route = createFileRoute('/signin')({ component: SignIn })

function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    navigate({ to: '/' })
  }

  return (
    <main className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-brand-black lg:flex">
        <div className="text-center">
          <span className="inline-block bg-brand-lime px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-black">
            StrideWear
          </span>
          <h2 className="mt-8 font-display text-6xl uppercase text-brand-white leading-none">
            Welcome
          </h2>
          <h2 className="font-display text-6xl uppercase text-brand-lime leading-none">
            Back
          </h2>
          <p className="mt-6 max-w-xs text-brand-gray-400">
            Sign in to access your orders, wishlist, and personalized gear.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-brand-gray-50 px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <span className="inline-block bg-brand-lime px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-black">
              StrideWear
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl uppercase text-brand-black">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-brand-gray-400">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-brand-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand-lime"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-brand-black underline decoration-brand-lime decoration-2 underline-offset-4"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-brand-black underline decoration-brand-lime decoration-2 underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
