import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Folder, FlaskConical, BookOpen, Mail, LogOut, Home,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { path: '/admin/dashboard', label: '概览', icon: LayoutDashboard },
  { path: '/admin/about', label: '关于我', icon: User },
  { path: '/admin/projects', label: '项目', icon: Folder },
  { path: '/admin/labs', label: '实验室', icon: FlaskConical },
  { path: '/admin/logs', label: '成长日志', icon: BookOpen },
  { path: '/admin/contact', label: '联系方式', icon: Mail },
  { path: '/admin/site-config', label: '首页配置', icon: Home },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-bg-secondary border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <NavLink to="/admin/dashboard" className="text-lg font-bold text-text-primary hover:text-accent transition-colors">
          管理后台
        </NavLink>
        <p className="text-xs text-text-secondary mt-1">个人内容管理系统</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary transition-colors"
        >
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    </aside>
  )
}
