import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/auth/confirm')({ component: AuthConfirm })

function useVerificationStatus() {
  return useMemo(() => {
    const hash = window.location.hash

    if (!hash) {
      return { status: 'error' as const, message: 'No verification token found.' }
    }

    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (!accessToken || !refreshToken) {
      return { status: 'error' as const, message: 'Invalid verification link.' }
    }

    return { status: 'pending' as const, accessToken, refreshToken, type }
  }, [])
}

function AuthConfirm() {
  const verification = useVerificationStatus()

  if (verification.status === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl uppercase text-brand-black">
            Verification Failed
          </h1>
          <p className="mt-4 text-brand-gray-700">{verification.message}</p>
          <Link to="/signup" className="mt-8 inline-block">
            <Button variant="secondary">Try Signing Up Again</Button>
          </Link>
        </div>
      </main>
    )
  }

  return <PendingVerification accessToken={verification.accessToken} refreshToken={verification.refreshToken} type={verification.type} />
}

import { useEffect, useState } from 'react'

function PendingVerification({
  accessToken,
  refreshToken,
  type,
}: {
  accessToken: string
  refreshToken: string
  type: string | null
}) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    import('#/lib/supabase').then(({ supabase }) => {
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
    })
  }, [accessToken, refreshToken, type])

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl uppercase text-brand-black">
            Verifying...
          </h1>
          <p className="mt-4 text-brand-gray-700">
            Please wait while we verify your email.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-gray-50 px-4">
      <div className="w-full max-w-md text-center">
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
