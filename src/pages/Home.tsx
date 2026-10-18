import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import useScrollProgress from '../hooks/useScrollProgress'
import { ArrowRight, ExternalLink, BookOpen, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useLogs } from '../hooks/useLogs'
import { useHomeConfig } from '../hooks/useSiteConfig'
import { useSpaceModules } from '../hooks/useSpaceModules'
import PersonalSpacePreview from '../components/PersonalSpacePreview'
import ProjectCover, { COVER_ASPECT } from '../components/ProjectCover'
import SpotlightCard from '../components/SpotlightCard'
import TerminalCard from '../components/TerminalCard'
import Marquee from '../components/Marquee'
import PageMeta from '../components/PageMeta'
import { getFeaturedProjects } from '../lib/featuredProjects'
import type { Project } from '../types/database'

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

interface ParallaxLayerProps {
  children: ReactNode
  distance: number
  fade?: boolean
  className?: string
}

function ParallaxLayer({ children, distance, fade = true, className = '' }: ParallaxLayerProps) {
  const reduceMotion = useReducedMotion()
  const isWide = useMediaQuery('(min-width: 768px)')

  if (!isWide || reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <ParallaxInner distance={distance} fade={fade} className={className}>
      {children}
    </ParallaxInner>
  )
}

function ParallaxInner({
  children,
  distance,
  fade,
  className,
}: {
  children: ReactNode
  distance: number
  fade: boolean
  className: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useScrollProgress(({ scrollY }) => {
    const element = ref.current
    if (!element) return
    const moveProgress = Math.min(Math.max(scrollY / 600, 0), 1)
    const fadeProgress = Math.min(Math.max(scrollY / 520, 0), 1)
    element.style.transform = `translate3d(0, ${moveProgress * distance}px, 0)`
    element.style.opacity = String(fade ? 1 - fadeProgress * 0.65 : 1)
  })

  return (
    <div ref={ref} data-parallax="true" className={`${className} will-change-transform`}>
      {children}
    </div>
  )
}

interface HomeProjectCardProps {
  project: Project
  index: number
  layout: 'hero' | 'single' | 'default'
}

function HomeProjectCard({ project, index, layout }: HomeProjectCardProps) {
  const aspect =
    layout === 'hero'
      ? 'aspect-[16/9] md:aspect-auto md:h-full lg:aspect-[16/9] lg:h-auto'
      : layout === 'single'
        ? 'aspect-[16/9] md:aspect-auto md:h-full'
        : COVER_ASPECT

  return (
    <SpotlightCard size={layout === 'default' ? 'md' : 'lg'} className="h-full">
      <Link
        to={`/projects/${project.slug}`}
        className={`flex h-full flex-col ${
          layout === 'hero' ? 'md:flex-row lg:flex-col' : layout === 'single' ? 'md:flex-row' : ''
        }`}
      >
        <div
          className={
            layout === 'default'
              ? ''
              : layout === 'hero'
                ? 'md:w-[45%] md:shrink-0 lg:w-full'
                : 'md:w-[45%] md:shrink-0'
          }
        >
          <ProjectCover
            slug={project.slug}
            title={project.title}
            techStack={project.tech_stack}
            coverImage={project.cover_image}
            index={index}
            aspect={aspect}
          />
        </div>
        <div
          className={`flex flex-col p-5 md:p-6 ${
            layout === 'hero' ? 'flex-1 lg:justify-center' : 'flex-1'
          } ${layout === 'single' ? 'md:justify-center' : ''}`}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-border bg-bg-primary px-2 py-0.5 text-xs text-text-secondary">
              {project.tech_stack[0] || project.tags[0] || '项目'}
            </span>
            {project.featured && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent-alt">
                Featured
              </span>
            )}
          </div>
          <h3
            className={`mb-2 font-semibold text-text-primary transition-colors group-hover:text-accent ${
              layout === 'default' ? 'text-lg' : 'text-xl md:text-2xl'
            }`}
          >
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {project.description}
          </p>
          <div
            className={`flex items-center justify-between pt-4 text-xs text-text-secondary ${
              layout === 'hero' ? 'mt-4' : 'mt-auto'
            }`}
          >
            <span className="font-mono">{project.tech_stack.slice(0, 3).join(' · ')}</span>
            <span className="inline-flex items-center gap-1 text-accent opacity-0 transition-opacity group-hover:opacity-100">
              详情 <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </SpotlightCard>
  )
}

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: logs, isLoading: logsLoading } = useLogs()
  const { data: config, isLoading: configLoading } = useHomeConfig()
  const { isLoading: spaceLoading } = useSpaceModules()
  const loading = projectsLoading || logsLoading || configLoading || spaceLoading
  const featuredProjects = useMemo(() => getFeaturedProjects(projects ?? []), [projects])

  if (loading) {
    return (
      <div className="pt-16 min-h-[60vh] flex items-center justify-center">
        <PageMeta title="丁鹏翔 - 个人开发者电子名片" description="丁鹏翔的个人开发者电子名片，展示项目作品、技术实验和成长历程。" />
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  const skills = config?.skills ?? []
  const greeting = config?.greeting ?? '你好，我是'
  const name = config?.name ?? '丁鹏翔'
  const bio = config?.bio ?? '一个学生开发者。'
  const buttonText = config?.button_text ?? '查看项目'
  const skillsTitle = config?.skills_title ?? '技术方向'
  const projectsTitle = config?.projects_title ?? '精选项目'
  const logsTitle = config?.logs_title ?? '最新日志'

  return (
    <div className="pt-16">
      <PageMeta title="丁鹏翔 - 个人开发者电子名片" description="丁鹏翔的个人开发者电子名片，展示项目作品、技术实验和成长历程。" />
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center px-4 md:px-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute inset-0 hero-glow" />
          <div className="absolute inset-0 bg-noise" />
        </div>
        <div className="relative max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* 左侧文字 */}
            <ParallaxLayer distance={-40} className="flex-1">
            <div className="flex-1">
              <motion.p
                className="text-accent text-sm md:text-base font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {greeting}
              </motion.p>
              <motion.h1
                className="text-gradient text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                initial="hidden"
                animate="visible"
              >
                {name.split('').map((char, i) => (
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
                {bio}
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
                  {buttonText}
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
            </ParallaxLayer>

            {/* 右侧终端卡片 */}
            <ParallaxLayer distance={40} fade={false}>
            <motion.div
              className="hidden md:flex relative w-[400px] h-[400px] items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <TerminalCard />
            </motion.div>
            </ParallaxLayer>
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
            {skillsTitle}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Marquee items={skills} />
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
              {projectsTitle}
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
          {featuredProjects.length > 0 ? (
            <div
              className={
                featuredProjects.length >= 3
                  ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2'
                  : featuredProjects.length === 2
                    ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
                    : 'max-w-5xl'
              }
            >
              {featuredProjects.map((project, index) => {
                const layout =
                  index === 0 && featuredProjects.length >= 3
                    ? 'hero'
                    : featuredProjects.length === 1
                      ? 'single'
                      : 'default'
                return (
                  <motion.div
                    key={project.slug}
                    className={layout === 'hero' ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <HomeProjectCard project={project} index={index} layout={layout} />
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm py-8 text-center">暂无项目，去后台添加第一个项目</p>
          )}
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
              {logsTitle}
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
          {logs && logs.length > 0 ? (
            <div className="space-y-4">
              {logs.slice(0, 3).map((log, index) => (
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
          ) : (
            <p className="text-text-secondary text-sm py-8 text-center">暂无日志，去后台写第一篇日志</p>
          )}
        </div>
      </section>

      {/* Personal Space */}
      <PersonalSpacePreview />
    </div>
  )
}
