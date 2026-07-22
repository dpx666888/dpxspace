import { motion } from 'framer-motion'
import { FlaskConical, Wrench, Play, Beaker, ExternalLink, Loader2 } from 'lucide-react'
import { useLabs } from '../hooks/useLabs'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

const typeIcons = {
  '工具': Wrench,
  'Demo': Play,
  '实验': Beaker,
}

const typeColors = {
  '工具': 'text-blue-400 bg-blue-400/10',
  'Demo': 'text-green-400 bg-green-400/10',
  '实验': 'text-purple-400 bg-purple-400/10',
}

export default function Lab() {
  const { data: labItems, isLoading, error } = useLabs()

  if (isLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error || !labItems) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">加载实验室项目失败，请稍后重试。</p>
      </div>
    )
  }
  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* 标题区 */}
        <motion.div className="mb-12 md:mb-16" {...fadeInUp}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <FlaskConical size={22} className="text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">实验室</h1>
          </div>
          <p className="text-text-secondary max-w-2xl">
            这里记录我的技术实验、小工具开发和Demo探索。每个实验都是一次学习机会。
          </p>
        </motion.div>

        {/* 实验室项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labItems.map((item, index) => {
            const Icon = typeIcons[item.type]
            const colorClass = typeColors[item.type]
            return (
              <motion.div
                key={item.id}
                className="p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 transition-all hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon size={16} />
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                      {item.type}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === '已完成'
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-yellow-400 bg-yellow-400/10'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tech_stack.map(tech => (
                    <span
                      key={tech}
                      className="text-xs text-text-secondary px-2 py-0.5 bg-bg-primary rounded-full border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {item.demo_url && (
                    <a
                      href={item.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light transition-colors"
                    >
                      访问 <ExternalLink size={12} />
                    </a>
                  )}
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
                    >
                      源码 <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
