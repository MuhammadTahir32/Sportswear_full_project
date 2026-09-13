import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export const Route = createFileRoute('/forgot-password')({ component: ForgotPassword })

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    })

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccess(true)
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
              Reset
            </h2>
            <h2 className="font-display text-6xl uppercase text-brand-lime leading-none">
              Your Password
            </h2>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-brand-gray-50 px-6 lg:w-1/2">
          <div className="w-full max-w-md text-center">
            <h1 className="font-display text-4xl uppercase text-brand-black">
              Check Your Email
            </h1>
            <p className="mt-4 text-brand-gray-400">
              We sent a password reset link to{' '}
              <span className="text-brand-lime">{email}</span>. Click the link
              to set a new password.
            </p>
            <p className="mt-6 text-sm text-brand-gray-400">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="font-semibold text-brand-black underline decoration-brand-lime decoration-2 underline-offset-4"
              >
                try again
              </button>
            </p>
            <Link to="/signin" className="mt-8 inline-block">
              <Button variant="secondary">Back to Sign In</Button>
            </Link>
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
            Forgot
          </h2>
          <h2 className="font-display text-6xl uppercase text-brand-lime leading-none">
            Your Password?
          </h2>
          <p className="mt-6 max-w-xs text-brand-gray-400">
            No worries. Enter your email and we&apos;ll send you a reset link.
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
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-brand-gray-400">
            Enter your email to receive a reset link
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

            <Button
              type="submit"
              className="w-full bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-gray-400">
            Remember your password?{' '}
            <Link
              to="/signin"
              className="font-bold text-brand-black underline decoration-brand-lime decoration-2 underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
