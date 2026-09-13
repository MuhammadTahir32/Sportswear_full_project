import { useEffect, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export const Route = createFileRoute('/reset-password')({ component: ResetPassword })

function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

  useEffect(() => {
    const hash = window.location.hash

    if (!hash) {
      setIsValidToken(false)
      return
    }

    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setIsValidToken(false)
      return
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setIsValidToken(false)
        } else {
          setIsValidToken(true)
        }
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    const { error: authError } = await supabase.auth.updateUser({ password })

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
  }

  if (isValidToken === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-gray-50">
        <p className="text-brand-gray-400">Verifying reset link...</p>
      </main>
    )
  }

  if (isValidToken === false) {
    return (
      <main className="flex min-h-screen">
        <div className="hidden w-1/2 items-center justify-center bg-brand-black lg:flex">
          <div className="text-center">
            <span className="inline-block bg-brand-lime px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-black">
              StrideWear
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-brand-gray-50 px-6 lg:w-1/2">
          <div className="w-full max-w-md text-center">
            <h1 className="font-display text-4xl uppercase text-brand-black">
              Invalid Link
            </h1>
            <p className="mt-4 text-brand-gray-400">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="mt-8 inline-block">
              <Button className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark">
                Request New Link
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main className="flex min-h-screen">
        <div className="hidden w-1/2 items-center justify-center bg-brand-black lg:flex">
          <div className="text-center">
            <span className="inline-block bg-brand-lime px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-black">
              StrideWear
            </span>
            <h2 className="mt-8 font-display text-6xl uppercase text-brand-white leading-none">
              Password
            </h2>
            <h2 className="font-display text-6xl uppercase text-brand-lime leading-none">
              Updated
            </h2>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-brand-gray-50 px-6 lg:w-1/2">
          <div className="w-full max-w-md text-center">
            <h1 className="font-display text-4xl uppercase text-brand-black">
              Password Updated
            </h1>
            <p className="mt-4 text-brand-gray-400">
              Your password has been changed successfully.
            </p>
            <button
              onClick={() => {
                supabase.auth.signOut()
                navigate({ to: '/signin' })
              }}
              className="mt-8 inline-block"
            >
              <Button className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark">
                Sign In With New Password
              </Button>
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-brand-black lg:flex">
        <div className="text-center">
          <span className="inline-block bg-brand-lime px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-black">
            StrideWear
          </span>
          <h2 className="mt-8 font-display text-6xl uppercase text-brand-white leading-none">
            Set New
          </h2>
          <h2 className="font-display text-6xl uppercase text-brand-lime leading-none">
            Password
          </h2>
          <p className="mt-6 max-w-xs text-brand-gray-400">
            Choose a strong password you haven&apos;t used before.
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
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-brand-gray-400">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700"
              >
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700"
              >
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
              isLoading={isLoading}
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
