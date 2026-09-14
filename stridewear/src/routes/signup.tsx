import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export const Route = createFileRoute('/signup')({ component: SignUp })

function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: 'http://localhost:3000/auth/confirm',
      },
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
      <main className="flex min-h-screen items-center justify-center bg-brand-black px-4">
        <div className="w-full max-w-md text-center">
          <span className="inline-block bg-brand-lime px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-black">
            StrideWear
          </span>
          <h1 className="mt-6 font-display text-4xl uppercase text-brand-white">
            Check Your Email
          </h1>
          <p className="mt-4 text-brand-gray-400">
            We sent a verification link to{' '}
            <span className="text-brand-lime">{email}</span>. Click the link to
            activate your account.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signin">
              <Button variant="secondary">
                Back to Sign In
              </Button>
            </Link>
            <button
              onClick={() => {
                setSuccess(false)
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                setFullName('')
              }}
            >
              <Button className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark">
                Sign Up Another Email
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
            Your Next
          </h2>
          <h2 className="font-display text-6xl uppercase text-brand-lime leading-none">
            Move Starts
          </h2>
          <h2 className="font-display text-6xl uppercase text-brand-white leading-none">
            Here
          </h2>
          <p className="mt-6 max-w-xs text-brand-gray-400">
            Performance sportswear engineered for athletes who push limits.
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
            Create Account
          </h1>
          <p className="mt-2 text-sm text-brand-gray-400">
            Join StrideWear and start shopping
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                Confirm Password
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
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-gray-400">
            Already have an account?{' '}
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
