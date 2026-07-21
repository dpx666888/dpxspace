import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, GraduationCap, FolderCheck, FileText } from 'lucide-react'
import { logs } from '../data/logs'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const categories = ['全部', '学习', '项目复盘', '技术笔记'] as const

const categoryIcons = {
  '学习': GraduationCap,
  '项目复盘': FolderCheck,
  '技术笔记': FileText,
}

const categoryColors = {
  '学习': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  '项目复盘': 'text-green-400 bg-green-400/10 border-green-400/20',
  '技术笔记': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
}

export default function LogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('全部')

  const filteredLogs = activeCategory === '全部'
    ? logs
    : logs.filter(log => log.category === activeCategory)

  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* 标题区 */}
        <motion.div className="mb-12 md:mb-16" {...fadeInUp}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg">
              <BookOpen size={22} className="text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">成长日志</h1>
          </div>
          <p className="text-text-secondary max-w-2xl">
            记录学习过程、项目复盘和技术笔记，形成个人成长档案。
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          className="flex flex-wrap gap-3 mb-10"
          {...fadeInUp}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary border border-border hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* 日志列表 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filteredLogs.map((log, index) => {
              const Icon = categoryIcons[log.category]
              const colorClass = categoryColors[log.category]
              return (
                <motion.div
                  key={log.id}
                  className="p-5 bg-bg-secondary border border-border rounded-xl hover:border-accent/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    {/* 左侧：分类+日期 */}
                    <div className="flex items-center gap-3 md:w-40 shrink-0">
                      <div className={`p-1.5 rounded-lg ${colorClass}`}>
                        <Icon size={14} />
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>
                        {log.category}
                      </span>
                      <span className="text-xs text-text-secondary">{log.date}</span>
                    </div>

                    {/* 右侧：内容 */}
                    <div className="flex-1">
                      <h3 className="font-medium text-text-primary mb-1">{log.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-2">{log.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {log.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs text-text-secondary px-2 py-0.5 bg-bg-primary rounded-full border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-secondary">该分类下暂无日志</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
