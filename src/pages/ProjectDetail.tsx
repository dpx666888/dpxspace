import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Clock, AlertCircle, Lightbulb, Trophy, BookOpen, Sparkles } from 'lucide-react'
import { projects } from '../data/projects'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">项目未找到</h1>
          <Link to="/projects" className="text-accent hover:underline">
            返回项目列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <motion.div {...fadeInUp}>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={16} /> 返回项目列表
          </Link>
        </motion.div>

        {/* 项目标题 */}
        <motion.div className="mb-12" {...fadeInUp}>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="text-xs text-text-secondary px-2 py-0.5 bg-bg-secondary rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {project.title}
          </h1>
          <p className="text-text-secondary text-lg">{project.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span
                  key={tech}
                  className="text-sm text-accent px-3 py-1 bg-accent/10 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors text-sm"
            >
              <Github size={16} /> 查看源码
            </a>
          </div>
        </motion.div>

        {/* 项目档案 */}
        <div className="space-y-10">
          {/* 为什么开始 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Lightbulb size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">为什么开始</h2>
            </div>
            <div className="p-6 bg-bg-secondary border border-border rounded-xl">
              <p className="text-text-secondary leading-relaxed">{project.story.why}</p>
            </div>
          </motion.section>

          {/* 设计过程 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <BookOpen size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">设计过程</h2>
            </div>
            <div className="p-6 bg-bg-secondary border border-border rounded-xl">
              <p className="text-text-secondary leading-relaxed">{project.story.design}</p>
            </div>
          </motion.section>

          {/* 开发过程 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">开发过程</h2>
            </div>
            <div className="p-6 bg-bg-secondary border border-border rounded-xl">
              <p className="text-text-secondary leading-relaxed">{project.story.development}</p>
            </div>
          </motion.section>

          {/* 遇到的问题 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <AlertCircle size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">遇到的问题</h2>
            </div>
            <div className="space-y-4">
              {project.story.problems.map((problem, index) => (
                <div
                  key={index}
                  className="p-6 bg-bg-secondary border border-border rounded-xl"
                >
                  <h3 className="font-medium text-text-primary mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 解决方案 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Sparkles size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">解决方案</h2>
            </div>
            <div className="p-6 bg-bg-secondary border border-border rounded-xl">
              <p className="text-text-secondary leading-relaxed">{project.story.solutions}</p>
            </div>
          </motion.section>

          {/* 最终成果 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Trophy size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">最终成果</h2>
            </div>
            <div className="p-6 bg-bg-secondary border border-border rounded-xl">
              <p className="text-text-secondary leading-relaxed">{project.story.result}</p>
            </div>
          </motion.section>

          {/* 个人收获 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <BookOpen size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">个人收获</h2>
            </div>
            <div className="p-6 bg-bg-secondary border border-border rounded-xl">
              <p className="text-text-secondary leading-relaxed">{project.story.summary}</p>
            </div>
          </motion.section>

          {/* 开发时间线 */}
          <motion.section {...fadeInUp}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock size={18} className="text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">开发时间线</h2>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-6">
                {project.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg-primary" />
                    <span className="text-xs text-accent font-medium">{event.date}</span>
                    <p className="text-sm text-text-secondary mt-1">{event.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* AI协作 */}
          {project.aiCollaboration && (
            <motion.section {...fadeInUp}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Sparkles size={18} className="text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">AI 协作</h2>
              </div>
              <div className="p-6 bg-bg-secondary border border-border rounded-xl">
                <p className="text-text-secondary leading-relaxed">{project.aiCollaboration}</p>
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  )
}
