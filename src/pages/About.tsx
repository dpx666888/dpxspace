import { motion } from 'framer-motion'
import {
  Code2, Terminal, BookOpen, Globe, Award, GraduationCap, Cpu, Wrench, Loader2,
} from 'lucide-react'
import { profile } from '../data/profile'
import { useAbout } from '../hooks/useAbout'
import type { AboutData } from '../types/database'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Terminal, BookOpen, Globe, Award, GraduationCap, Cpu, Wrench,
}

const sectionLabels: Record<string, string> = {
  about: '关于我',
  education: '教育经历',
  tech: '技术方向',
  practices: '实践经历',
  certificates: '技能与证书',
  growth: '成长路线',
  ai: 'AI 协作',
}

const DEFAULT_ORDER = ['about', 'education', 'tech', 'practices', 'certificates', 'growth']

function renderSection(key: string, about: AboutData) {
  switch (key) {
    case 'about':
      return (
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-secondary border-2 border-border object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-4">
                {profile.name}
              </h2>
              {about.intro.map((paragraph, i) => (
                <p key={i} className="text-text-secondary leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.section>
      )
    case 'education':
      return (
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <div className="p-6 bg-bg-secondary border border-border rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{about.education.school}</h3>
                <p className="text-text-secondary">{about.education.major}</p>
              </div>
              <span className="text-sm text-accent shrink-0">{about.education.period}</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary"><span className="text-text-primary">主修课程：</span>{about.education.courses}</p>
              <p className="text-sm text-text-secondary"><span className="text-text-primary">学业成绩：</span>{about.education.achievements}</p>
              <p className="text-sm text-text-secondary"><span className="text-text-primary">竞赛荣誉：</span>{about.education.competitions}</p>
            </div>
          </div>
        </motion.section>
      )
    case 'tech':
      return (
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.tech_stack.map(cat => {
              const Icon = iconMap[cat.icon]
              return (
                <div key={cat.title} className="p-6 bg-bg-secondary border border-border rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{cat.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-bg-primary border border-border rounded-full text-sm text-text-secondary">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>
      )
    case 'practices':
      return (
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <div className="space-y-6">
            {about.practice.map((exp, index) => {
              const Icon = iconMap[exp.icon]
              return (
                <motion.div
                  key={index}
                  className="p-6 bg-bg-secondary border border-border rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-accent/10 rounded-lg shrink-0">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-text-primary">{exp.title}</h3>
                        <span className="text-xs text-accent px-2 py-0.5 bg-accent/10 rounded-full shrink-0">{exp.role}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{exp.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>
      )
    case 'certificates':
      return (
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.certificates.map((cert, index) => {
              const Icon = iconMap[cert.icon]
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-bg-secondary border border-border rounded-xl min-h-[72px]">
                  <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <span className="text-sm text-text-primary break-words leading-relaxed">{cert.name}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-6">
            <h3 className="text-base font-semibold text-text-primary mb-3">办公技能</h3>
            <div className="flex flex-wrap gap-3">
              {['MS Office', 'WPS', '文档处理', '数据分析'].map(skill => (
                <span key={skill} className="px-4 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.section>
      )
    case 'growth':
      return (
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-8">
              {about.growth_route.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg-primary" />
                  <span className="text-xs text-accent font-medium">{item.period}</span>
                  <h3 className="text-base font-semibold text-text-primary mt-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )
    default:
      return null
  }
}

export default function About() {
  const { data: about, isLoading, error } = useAbout()

  if (isLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  if (error || !about) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <p className="text-text-secondary">加载关于我信息失败，请稍后重试。</p>
      </div>
    )
  }

  const order = about.section_order?.length ? about.section_order : DEFAULT_ORDER

  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">关于我</h1>
        </motion.section>

        {order.map(key => (
          <div key={key}>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">{sectionLabels[key]}</h2>
            {renderSection(key, about)}
          </div>
        ))}
      </div>
    </div>
  )
}
