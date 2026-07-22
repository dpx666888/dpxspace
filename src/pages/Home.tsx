import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Code2, BookOpen, Globe, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useLogs } from '../hooks/useLogs'

const skills = ['C++', 'Vue', 'uni-app', 'Git', 'React', 'TypeScript', 'Tailwind CSS']

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: logs, isLoading: logsLoading } = useLogs()
  const loading = projectsLoading || logsLoading

  if (loading) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center px-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* 左侧文字 */}
            <div className="flex-1">
              <motion.p
                className="text-accent text-sm md:text-base font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                你好，我是
              </motion.p>
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-text-primary mb-6"
                initial="hidden"
                animate="visible"
              >
                {'丁鹏翔'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-text-secondary max-w-2xl mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                一个学生开发者，利用 AI 和自己的代码，不断建造属于自己的数字世界。
              </motion.p>
              <motion.div
                className="flex items-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
                >
                  查看项目
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="https://github.com/dpx666888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary rounded-lg font-medium hover:bg-bg-secondary transition-colors"
                >
                  GitHub
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            </div>

            {/* 右侧装饰元素 */}
            <motion.div
              className="hidden md:block relative w-[400px] h-[400px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* 大背景圆环 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-accent/10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-accent/5"></div>

              {/* 代码块 */}
              <motion.div
                className="absolute top-8 right-4 w-56 rounded-xl bg-bg-secondary border border-border overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                </div>
                <div className="p-4 space-y-2 font-mono text-xs">
                  <div className="h-2 w-3/4 bg-text-secondary/15 rounded" />
                  <div className="h-2 w-1/2 bg-text-secondary/15 rounded" />
                  <div className="h-2 w-2/3 bg-text-secondary/15 rounded" />
                  <div className="h-2 w-1/3 bg-accent/30 rounded" />
                  <div className="h-2 w-1/2 bg-text-secondary/15 rounded" />
                </div>
              </motion.div>

              {/* 小方块 */}
              <motion.div
                className="absolute bottom-16 left-8 w-20 h-20 rounded-xl bg-accent/5 border border-accent/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="p-3 space-y-1.5">
                  <div className="h-1.5 w-full bg-accent/20 rounded" />
                  <div className="h-1.5 w-2/3 bg-accent/20 rounded" />
                  <div className="h-1.5 w-3/4 bg-accent/20 rounded" />
                </div>
              </motion.div>

              {/* 浮动圆点 */}
              <motion.div
                className="absolute top-4 left-16 w-3 h-3 rounded-full bg-accent/30"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              ></motion.div>
              <motion.div
                className="absolute bottom-8 right-20 w-2 h-2 rounded-full bg-accent/20"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-text-primary mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            技术方向
          </motion.h2>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {skills.map(skill => (
              <span
                key={skill}
                className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-primary"
              >
                {skill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              精选项目
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/projects"
                className="text-accent text-sm hover:text-accent-light transition-colors inline-flex items-center gap-1"
              >
                查看全部 <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.slice(0, 3).map((project, index) => {
              const Icon = project.tech_stack.includes('C++') ? Code2 : Globe
              const lang = project.tech_stack[0] || project.tags[0] || '项目'
              return (
                <motion.a
                  key={project.slug}
                  href={project.github_url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 transition-all hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <span className="text-xs text-text-secondary px-2 py-0.5 bg-bg-primary rounded-full border border-border">
                      {lang}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {project.description}
                  </p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Latest Logs */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              className="text-2xl md:text-3xl font-semibold text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              最新日志
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                to="/log"
                className="text-accent text-sm hover:text-accent-light transition-colors inline-flex items-center gap-1"
              >
                查看全部 <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
          <div className="space-y-4">
            {logs?.slice(0, 3).map((log, index) => (
              <motion.div
                key={log.id}
                className="p-5 bg-bg-secondary border border-border rounded-xl hover:border-accent/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  <div className="flex items-center gap-3 md:w-40 shrink-0">
                    <BookOpen size={14} className="text-accent" />
                    <span className="text-xs text-text-secondary">{log.date}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">{log.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{log.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
