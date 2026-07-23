import { motion } from 'framer-motion'
import {
  Code2, Terminal, BookOpen, Zap, Globe, MessageSquare, Award, GraduationCap, Cpu, Wrench, Loader2,
} from 'lucide-react'
import { aiCollabs } from '../data/aiCollabs'
import { profile } from '../data/profile'
import { useAbout } from '../hooks/useAbout'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Terminal, BookOpen, Globe, Award, GraduationCap, Cpu, Wrench,
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
  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* 个人简介 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">关于我</h1>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* 头像 */}
            <div className="shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-secondary border-2 border-border object-cover"
              />
            </div>
            {/* 介绍文字 */}
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

        {/* 教育经历 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">教育经历</h2>
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

        {/* 技术方向 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">技术方向</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.tech_stack.map(cat => {
              const Icon = iconMap[cat.icon]
              return (
                <div
                  key={cat.title}
                  className="p-6 bg-bg-secondary border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{cat.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-bg-primary border border-border rounded-full text-sm text-text-secondary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        {/* 实践经历 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">实践经历</h2>
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

        {/* 技能证书 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">技能与证书</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.certificates.map((cert, index) => {
              const Icon = iconMap[cert.icon]
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-bg-secondary border border-border rounded-xl min-h-[72px]"
                >
                  <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <span className="text-sm text-text-primary break-words leading-relaxed">{cert.name}</span>
                </div>
              )
            })}
          </div>
          <p className="text-sm text-text-secondary mt-4">办公技能：熟练使用 MS Office/WPS 办公软件</p>
        </motion.section>

        {/* 成长路线 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">成长路线</h2>
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

        {/* AI协作介绍 */}
        <motion.section {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">AI 协作</h2>
          <div className="p-6 md:p-8 bg-bg-secondary border border-border rounded-xl mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-xl shrink-0">
                <Zap size={22} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  人与 AI 共同开发
                </h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  在学习和开发过程中，我积极使用 AI 工具辅助编程。从代码调试、跨端兼容性问题解决，到项目架构设计和 UI 样式生成，AI 是我的重要协作伙伴。
                </p>
                <p className="text-text-secondary leading-relaxed">
                  例如：在螃蟹记账开发中，使用 AI 辅助解决 uni-app 多端适配问题；在 AixProbe 硬件项目中，借助 AI 排查电路故障和优化焊接工艺；在搭建这个个人网站时，与 AI 协作完成从设计到实现的全流程。
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-text-primary mb-4">协作记录</h3>
          <div className="space-y-4">
            {aiCollabs.map((collab, index) => (
              <motion.div
                key={collab.id}
                className="p-5 bg-bg-secondary border border-border rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 bg-accent/10 rounded-lg">
                    <MessageSquare size={14} className="text-accent" />
                  </div>
                  <span className="text-xs text-text-secondary">{collab.date}</span>
                  {collab.project && (
                    <span className="text-xs text-accent px-2 py-0.5 bg-accent/10 rounded-full">
                      {collab.project}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-text-primary mb-2">{collab.title}</h4>
                <p className="text-sm text-text-secondary mb-3">{collab.context}</p>
                <div className="bg-bg-primary border border-border rounded-lg p-3 mb-3">
                  <p className="text-xs text-text-secondary mb-1">Prompt：</p>
                  <p className="text-sm text-text-primary">{collab.prompt}</p>
                </div>
                <div className="bg-bg-primary border border-border rounded-lg p-3">
                  <p className="text-xs text-text-secondary mb-1">结果：</p>
                  <p className="text-sm text-text-primary">{collab.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
