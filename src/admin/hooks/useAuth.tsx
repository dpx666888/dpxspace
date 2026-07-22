import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { getCurrentUser, onAuthStateChange, signOut } from '../../services/auth.service'
import { isSupabaseConfigured } from '../../services/supabase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isConfigured: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    getCurrentUser().then(setUser).finally(() => setLoading(false))

    const { subscription } = onAuthStateChange(setUser)
    return () => subscription.unsubscribe()
  }, [isConfigured])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return ctx
}

export function useIsAdmin() {
  const { user, loading } = useAuth()
  return { isAdmin: !!user, loading }
}
