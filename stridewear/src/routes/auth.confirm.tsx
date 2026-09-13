import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/auth/confirm')({ component: AuthConfirm })

function AuthConfirm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const hash = window.location.hash

    if (!hash) {
      setStatus('error')
      setMessage('No verification token found.')
      return
    }

    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (!accessToken || !refreshToken) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }

    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setStatus('error')
          setMessage(error.message)
        } else if (type === 'signup') {
          setStatus('success')
          setMessage('Email verified! Your account is now active.')
        } else {
          setStatus('success')
          setMessage('Session restored successfully.')
        }
      })
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <h1 className="font-display text-3xl uppercase text-brand-black">
              Verifying...
            </h1>
            <p className="mt-4 text-brand-gray-700">
              Please wait while we verify your email.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="font-display text-3xl uppercase text-brand-black">
              Email Verified
            </h1>
            <p className="mt-4 text-brand-gray-700">{message}</p>
            <Link to="/signin" className="mt-8 inline-block">
              <Button>Go to Sign In</Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="font-display text-3xl uppercase text-brand-black">
              Verification Failed
            </h1>
            <p className="mt-4 text-brand-gray-700">{message}</p>
            <Link to="/signup" className="mt-8 inline-block">
              <Button variant="secondary">Try Signing Up Again</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
