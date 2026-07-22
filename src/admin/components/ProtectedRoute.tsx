import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-text-primary mb-3">后台系统未配置</h1>
          <p className="text-text-secondary mb-4">
            请在 .env.local 中配置 Supabase 环境变量后刷新页面。
          </p>
          <code className="block bg-bg-secondary border border-border rounded-lg p-4 text-left text-sm text-text-secondary">
            VITE_SUPABASE_URL=...
            <br />
            VITE_SUPABASE_ANON_KEY=...
          </code>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
