import { useAuth } from '../hooks/useAuth'

export default function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-bg-secondary border-b border-border flex items-center justify-between px-6">
      <h1 className="text-text-primary font-semibold">个人内容管理系统</h1>
      <div className="text-sm text-text-secondary">
        {user?.email && <span>{user.email}</span>}
      </div>
    </header>
  )
}
