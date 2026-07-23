import { Link } from 'react-router-dom'
import { Github, Mail, Settings } from 'lucide-react'
import { useAuth } from '../admin/hooks/useAuth'

export default function Footer() {
  const { user } = useAuth()
  const adminPath = user ? '/admin/dashboard' : '/admin/login'

  return (
    <footer className="border-t border-border py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">
          丁鹏翔的个人电子名片
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dpx666888"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="mailto:2060786339@qq.com"
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="邮箱"
          >
            <Mail size={18} />
          </a>
          <Link
            to={adminPath}
            className="text-text-secondary hover:text-accent transition-colors"
            aria-label="后台管理"
            title="后台管理"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
