import { Link, useLocation } from 'react-router-dom'
import { Home, User, Folder, FlaskConical, BookOpen, Mail, Menu, X, LayoutGrid } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/about', label: '关于我', icon: User },
  { path: '/projects', label: '项目', icon: Folder },
  { path: '/lab', label: '实验室', icon: FlaskConical },
  { path: '/log', label: '日志', icon: BookOpen },
  { path: '/space', label: '个人空间', icon: LayoutGrid },
  { path: '/contact', label: '联系', icon: Mail },
]

export default function Header() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-text-primary hover:text-accent transition-colors">
          名片
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-primary p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="切换菜单"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-bg-primary border-b border-border px-4 pb-4">
          {navItems.map(item => {
            const Icon = item.icon
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition-colors ${
                  active
                    ? 'text-accent bg-accent/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
