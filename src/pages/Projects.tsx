import { motion } from 'framer-motion'
import { ArrowRight, Folder, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects()

  if (isLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error || !projects) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">加载项目失败，请稍后重试。</p>
      </div>
    )
  }
  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* 标题区 */}
        <motion.div className="mb-12 md:mb-16" {...fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">项目</h1>
          <p className="text-text-secondary max-w-2xl">
            每个项目都记录了从构想到实现的完整过程。点击项目卡片查看详细档案。
          </p>
        </motion.div>

        {/* 项目列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/projects/${project.slug}`}
                className="group block h-full p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Folder size={18} className="text-accent" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs text-text-secondary px-2 py-0.5 bg-bg-primary rounded-full border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map(tech => (
                      <span
                        key={tech}
                        className="text-xs text-accent px-2 py-0.5 bg-accent/10 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-accent text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    详情 <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
