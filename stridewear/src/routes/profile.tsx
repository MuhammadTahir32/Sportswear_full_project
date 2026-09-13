import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ProtectedRoute } from '#/components/auth/protected-route'

export const Route = createFileRoute('/profile')({ component: ProfileWrapper })

function ProfileWrapper() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  )
}

function Profile() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    supabase
      .from('profiles')
      .select('full_name, phone, role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name ?? '')
          setPhone(data.phone ?? '')
          setRole(data.role ?? 'customer')
        }
        setIsLoading(false)
      })
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(true)
    setIsSaving(true)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', user!.id)

    setIsSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray-50">
        <p className="font-display text-sm uppercase tracking-widest text-brand-gray-400">
          Loading profile...
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-4xl uppercase text-brand-black">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-brand-gray-400">
          Manage your account information
        </p>

        <div className="mt-8 rounded-sm border border-brand-gray-100 bg-white p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center bg-brand-lime font-display text-2xl uppercase text-brand-black">
              {fullName ? fullName.charAt(0) : user?.email?.charAt(0) ?? '?'}
            </div>
            <div>
              <p className="font-semibold text-brand-black">
                {fullName || 'No name set'}
              </p>
              <p className="text-sm text-brand-gray-400">{user?.email}</p>
              <span className="mt-1 inline-block bg-brand-black px-2 py-0.5 text-xs font-bold uppercase text-brand-lime">
                {role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                Profile updated successfully.
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700"
              >
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
              isLoading={isSaving}
            >
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
