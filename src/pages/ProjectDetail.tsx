import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Clock, AlertCircle, Lightbulb, Trophy, BookOpen, Sparkles, Star, Loader2 } from 'lucide-react'
import { useProject, useProjectTimeline } from '../hooks/useProjects'
import { useAiCollabs } from '../hooks/useAiCollabs'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(slug)
  const { data: timelineEvents } = useProjectTimeline(project?.id)
  const { data: aiCollabs } = useAiCollabs()
  const projectAi = aiCollabs?.filter(c => project?.id && c.project_id === project.id) ?? []

  if (projectLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (projectError || !project) {
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

  const events = timelineEvents?.length
    ? timelineEvents.map(e => ({ date: e.date, event: e.content || e.title || '' }))
    : (project.timeline ?? [])

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
              {project.tech_stack.map(tech => (
                <span
                  key={tech}
                  className="text-sm text-accent px-3 py-1 bg-accent/10 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={project.github_url ?? undefined}
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
                <Star size={18} className="text-accent" />
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
                {events.map((event, index) => (
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
          {(project.ai_collaboration || projectAi.length > 0) && (
            <motion.section {...fadeInUp}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Sparkles size={18} className="text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-text-primary">AI 协作</h2>
              </div>
              {project.ai_collaboration && (
                <div className="p-6 bg-bg-secondary border border-border rounded-xl mb-6">
                  <p className="text-text-secondary leading-relaxed">{project.ai_collaboration}</p>
                </div>
              )}
              {projectAi.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-text-secondary">协作记录</h3>
                  {projectAi.map((collab) => (
                    <div key={collab.id} className="p-4 bg-bg-secondary border border-border rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-text-secondary">{collab.date}</span>
                        <span className="text-xs font-medium text-accent">{collab.title}</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{collab.context}</p>
                      <div className="bg-bg-primary border border-border rounded-lg p-3">
                        <p className="text-xs text-text-secondary mb-1">Prompt & 结果</p>
                        <p className="text-sm text-text-primary">{collab.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </div>
      </div>
    </div>
  )
}
