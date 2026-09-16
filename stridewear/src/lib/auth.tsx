import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/lib/supabase'
import { mergeGuestCartOnLogin } from '#/hooks/use-cart'

interface Profile {
  full_name: string | null
  phone: string | null
  role: string
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  profile: Profile | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function fetchProfile(userId: string, setProfile: (p: Profile | null) => void) {
  supabase
    .from('profiles')
    .select('full_name, phone, role')
    .eq('id', userId)
    .single()
    .then(({ data }) => setProfile(data))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout)
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        if (session?.user) {
          fetchProfile(session.user.id, setProfile)
          mergeGuestCartOnLogin(session.user.id, queryClient)
        }
      })
      .catch(() => {
        clearTimeout(timeout)
        setIsLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      if (session?.user) {
        fetchProfile(session.user.id, setProfile)
        mergeGuestCartOnLogin(session.user.id, queryClient)
      } else {
        setProfile(null)
      }
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [queryClient])

  return (
    <AuthContext.Provider value={{ user, session, isLoading, profile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export async function signOut() {
  await supabase.auth.signOut()
}
