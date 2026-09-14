import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { useAuth } from '#/lib/auth'

export interface Address {
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

export function useAddresses() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async (): Promise<Address[]> => {
      if (!user) return []

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })

      if (error) throw error
      return data ?? []
    },
    enabled: !!user,
  })

  const addAddress = useMutation({
    mutationFn: async (form: typeof emptyAddress) => {
      if (!user) throw new Error('Not authenticated')

      if (form.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
      }

      const { error } = await supabase
        .from('addresses')
        .insert({ ...form, user_id: user.id })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] })
    },
  })

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] })
    },
  })

  const setDefault = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated')

      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] })
    },
  })

  return {
    addresses,
    isLoading,
    addAddress,
    deleteAddress,
    setDefault,
  }
}

export { emptyAddress }
