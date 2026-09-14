import { useState } from 'react'
import { useAddresses, emptyAddress } from '#/hooks/use-addresses'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import type { Address } from '#/hooks/use-addresses'

type AddressStepProps = {
  selectedAddress: Address | null
  onSelect: (address: Address) => void
}

export function AddressStep({ selectedAddress, onSelect }: AddressStepProps) {
  const { addresses, isLoading, addAddress, deleteAddress } = useAddresses()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyAddress)
  const [error, setError] = useState<string | null>(null)

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      await addAddress.mutateAsync(form)
      setShowForm(false)
      setForm(emptyAddress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address')
    }
  }

  function handleAddNew() {
    setForm(emptyAddress)
    setShowForm(true)
  }

  function handleSelectAddress(addr: Address) {
    onSelect(addr)
  }

  return (
    <div>
      <h2 className="font-display text-2xl uppercase text-brand-black">
        Shipping Address
      </h2>
      <p className="mt-1 text-sm text-brand-gray-400">
        Select a saved address or add a new one
      </p>

      {isLoading && (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-sm border border-brand-gray-100 bg-brand-gray-50"
            />
          ))}
        </div>
      )}

      {!isLoading && addresses.length === 0 && !showForm && (
        <div className="mt-8 rounded-sm border border-dashed border-brand-gray-100 p-8 text-center">
          <p className="text-brand-gray-400">No saved addresses</p>
          <Button
            onClick={handleAddNew}
            className="mt-4 bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
          >
            Add Your First Address
          </Button>
        </div>
      )}

      {!isLoading && addresses.length > 0 && !showForm && (
        <div className="mt-6 space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleSelectAddress(addr)}
              className={`cursor-pointer rounded-sm border p-5 transition-colors ${
                selectedAddress?.id === addr.id
                  ? 'border-brand-black bg-brand-gray-50'
                  : 'border-brand-gray-100 bg-white hover:border-brand-gray-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                      selectedAddress?.id === addr.id
                        ? 'border-brand-black'
                        : 'border-brand-gray-400'
                    }`}
                  >
                    {selectedAddress?.id === addr.id && (
                      <div className="mx-auto mt-0.5 h-2 w-2 rounded-full bg-brand-black" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm uppercase text-brand-black">
                        {addr.label}
                      </span>
                      {addr.is_default && (
                        <span className="bg-brand-lime px-2 py-0.5 text-[10px] font-bold uppercase text-brand-black">
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
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Delete this address?')) {
                      deleteAddress.mutate(addr.id)
                    }
                  }}
                  className="text-xs font-semibold uppercase text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddNew}
            className="w-full rounded-sm border border-dashed border-brand-gray-100 py-4 text-sm font-semibold uppercase tracking-widest text-brand-gray-400 transition-colors hover:border-brand-black hover:text-brand-black"
          >
            + Add New Address
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-6 rounded-sm border border-brand-gray-100 bg-white p-6">
          <h3 className="font-display text-lg uppercase text-brand-black">
            New Address
          </h3>

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
                  onChange={(e) =>
                    updateField('postal_code', e.target.value)
                  }
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
                  Set as default
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="bg-brand-lime text-brand-black hover:bg-brand-lime-dark"
                isLoading={addAddress.isPending}
              >
                Save Address
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
    </div>
  )
}
