import { motion } from 'framer-motion'
import { Folder, FlaskConical, BookOpen, User, Mail, Home, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { useProjects } from '../../hooks/useProjects'
import { useLabs } from '../../hooks/useLabs'
import { useLogs } from '../../hooks/useLogs'
import { useHomeConfig } from '../../hooks/useSiteConfig'

export default function AdminDashboard() {
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: labs, isLoading: labsLoading } = useLabs()
  const { data: logs, isLoading: logsLoading } = useLogs()
  const { data: homeConfig, isLoading: homeLoading } = useHomeConfig()

  const loading = projectsLoading || labsLoading || logsLoading || homeLoading

  const homePreview = homeConfig
    ? `${homeConfig.name} — ${homeConfig.bio.slice(0, 18)}...`
    : '-'

  const cards = [
    { label: '首页配置', icon: Home, path: '/admin/site-config', color: 'text-cyan-400 bg-cyan-400/10', display: homePreview },
    { label: '关于我', icon: User, path: '/admin/about', color: 'text-yellow-400 bg-yellow-400/10', display: '管理' },
    { label: '项目', icon: Folder, path: '/admin/projects', color: 'text-blue-400 bg-blue-400/10', display: projectsLoading ? '-' : (projects?.length ?? 0) },
    { label: '实验室', icon: FlaskConical, path: '/admin/labs', color: 'text-purple-400 bg-purple-400/10', display: labsLoading ? '-' : (labs?.length ?? 0) },
    { label: '成长日志', icon: BookOpen, path: '/admin/logs', color: 'text-green-400 bg-green-400/10', display: logsLoading ? '-' : (logs?.length ?? 0) },
    { label: '联系方式', icon: Mail, path: '/admin/contact', color: 'text-pink-400 bg-pink-400/10', display: '管理' },
  ]

  return (
    <AdminLayout title="概览">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-text-secondary mb-8">
          欢迎来到管理后台。在这里你可以管理个人网站的全部内容，修改后会自动同步到前台页面。
        </p>

        {loading && (
          <div className="mb-6 flex items-center gap-2 text-text-secondary text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> 正在加载数据...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                to={card.path}
                className="group p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-sm font-medium text-text-primary text-right max-w-[120px] truncate">
                    {card.display}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">{card.label}</h3>
              </Link>
            )
          })}
        </div>
      </motion.div>
    </AdminLayout>
  )
}
