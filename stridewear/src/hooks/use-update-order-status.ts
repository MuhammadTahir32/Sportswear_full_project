import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import type { OrderStatus } from '#/hooks/use-admin-orders'

interface UpdateOrderStatusParams {
  orderId: string
  status: OrderStatus
  trackingNumber?: string
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status, trackingNumber }: UpdateOrderStatusParams) => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }

      if (!session) {
        throw new Error('Not logged in. Please sign in again.')
      }

      if (trackingNumber) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status, tracking_number: trackingNumber })
          .eq('id', orderId)

        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`)
        }
      } else {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId)

        if (updateError) {
          throw new Error(`Update failed: ${updateError.message}`)
        }
      }

      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert({ order_id: orderId, status })

      if (historyError) {
        throw new Error(`History insert failed: ${historyError.message}`)
      }

      return { success: true, orderId, newStatus: status }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin-order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
    },
  })
}
