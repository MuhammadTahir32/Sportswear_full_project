import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ProtectedRoute } from '#/components/auth/protected-route'

export const Route = createFileRoute('/addresses')({ component: AddressesWrapper })

interface Address {
  id: string
  label: string
  full_name: string
  line1: string
  line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
}

const emptyAddress = {
  label: 'Home',
  full_name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'Pakistan',
  phone: '',
  is_default: false,
}

function AddressesWrapper() {
  return (
    <ProtectedRoute>
      <Addresses />
    </ProtectedRoute>
  )
}

function Addresses() {
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyAddress)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [user])

  async function fetchAddresses() {
    if (!user) return

    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    setAddresses(data ?? [])
    setIsLoading(false)
  }

  function handleAdd() {
    setEditingId(null)
    setForm(emptyAddress)
    setShowForm(true)
  }

  function handleEdit(addr: Address) {
    setEditingId(addr.id)
    setForm({
      label: addr.label,
      full_name: addr.full_name,
      line1: addr.line1,
      line2: addr.line2 ?? '',
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      phone: addr.phone,
      is_default: addr.is_default,
    })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this address?')) return

    const { error: deleteError } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)

    if (!deleteError) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    }
  }

  async function handleSetDefault(id: string) {
    if (!user) return

    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)

    await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)

    fetchAddresses()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    if (form.is_default) {
      if (!user) return
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from('addresses')
        .update(form)
        .eq('id', editingId)

      setIsSaving(false)

      if (updateError) {
        setError(updateError.message)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from('addresses')
        .insert({ ...form, user_id: user!.id })

      setIsSaving(false)

      if (insertError) {
        setError(insertError.message)
        return
      }
    }

    setShowForm(false)
    fetchAddresses()
  }

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <main className="min-h-screen bg-brand-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl uppercase text-brand-black">
              My Addresses
            </h1>
            <p className="mt-2 text-sm text-brand-gray-400">
              Manage your shipping addresses
            </p>
          </div>
          {!showForm && (
            <Button
              onClick={handleAdd}
              className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
            >
              + Add Address
            </Button>
          )}
        </div>

        {showForm && (
          <div className="mt-8 rounded-sm border border-brand-gray-100 bg-white p-6">
            <h2 className="font-display text-xl uppercase text-brand-black">
              {editingId ? 'Edit Address' : 'New Address'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {error && (
                <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    Label
                  </label>
                  <Input
                    value={form.label}
                    onChange={(e) => updateField('label', e.target.value)}
                    placeholder="Home, Office..."
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    Full Name
                  </label>
                  <Input
                    value={form.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                  Address Line 1
                </label>
                <Input
                  value={form.line1}
                  onChange={(e) => updateField('line1', e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                  Address Line 2 (Optional)
                </label>
                <Input
                  value={form.line2}
                  onChange={(e) => updateField('line2', e.target.value)}
                  placeholder="Apartment, suite, floor..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    City
                  </label>
                  <Input
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    State
                  </label>
                  <Input
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    Postal Code
                  </label>
                  <Input
                    value={form.postal_code}
                    onChange={(e) => updateField('postal_code', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    Country
                  </label>
                  <Input
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-brand-gray-700">
                    Phone
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+92 300 1234567"
                    required
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-brand-gray-700">
                    <input
                      type="checkbox"
                      checked={form.is_default}
                      onChange={(e) =>
                        updateField('is_default', e.target.checked)
                      }
                      className="h-4 w-4 accent-brand-lime"
                    />
                    Default address
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
                  isLoading={isSaving}
                >
                  {editingId ? 'Save Changes' : 'Add Address'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {!showForm && !isLoading && addresses.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-brand-gray-400">No addresses saved yet.</p>
            <Button
              onClick={handleAdd}
              className="mt-4 bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
            >
              Add Your First Address
            </Button>
          </div>
        )}

        {!showForm && !isLoading && addresses.length > 0 && (
          <div className="mt-8 space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-sm border border-brand-gray-100 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm uppercase text-brand-black">
                        {addr.label}
                      </span>
                      {addr.is_default && (
                        <span className="bg-brand-lime px-2 py-0.5 text-xs font-bold uppercase text-brand-black">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-brand-gray-700">
                      {addr.full_name}
                    </p>
                    <p className="text-sm text-brand-gray-400">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ''}
                    </p>
                    <p className="text-sm text-brand-gray-400">
                      {addr.city}, {addr.state} {addr.postal_code}
                    </p>
                    <p className="text-sm text-brand-gray-400">
                      {addr.country}
                    </p>
                    <p className="mt-1 text-sm text-brand-gray-400">
                      {addr.phone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-semibold uppercase text-brand-gray-400 hover:text-brand-black"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-xs font-semibold uppercase text-brand-gray-400 hover:text-brand-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-xs font-semibold uppercase text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
