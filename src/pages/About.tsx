import { motion } from 'framer-motion'
import { Code2, Terminal, BookOpen, Zap, Globe, MessageSquare } from 'lucide-react'
import { aiCollabs } from '../data/aiCollabs'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

const skillCategories = [
  {
    title: '编程语言',
    icon: Code2,
    skills: ['C++', 'JavaScript', 'TypeScript'],
  },
  {
    title: '前端框架',
    icon: Globe,
    skills: ['Vue', 'React'],
  },
  {
    title: '工具与工程化',
    icon: Terminal,
    skills: ['Git', 'Vite'],
  },
  {
    title: '正在学习',
    icon: BookOpen,
    skills: ['Tailwind CSS', 'Framer Motion'],
  },
]

const timeline = [
  {
    period: '2026.05',
    title: '注册 GitHub 账号',
    desc: '开启代码托管与开源之旅。',
  },
  {
    period: '2026.05',
    title: '创建第一个项目',
    desc: '基于 Vue 的应用项目开发。',
  },
  {
    period: '2026.07',
    title: '百日 C++ 学习计划',
    desc: '系统学习 C++ 编程语言。',
  },
  {
    period: '2026.07',
    title: '学习 Git 版本控制',
    desc: '掌握代码版本管理工具。',
  },
  {
    period: '2026.07',
    title: '搭建个人电子名片网站',
    desc: '使用 React + Tailwind CSS 构建个人主页。',
  },
]

export default function About() {
  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* 个人简介 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">关于我</h1>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* 头像占位 */}
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-bg-secondary border-2 border-border flex items-center justify-center">
                <span className="text-4xl md:text-5xl font-bold text-accent">丁</span>
              </div>
              <p className="text-xs text-text-secondary mt-3 text-center">头像待补充</p>
            </div>
            {/* 介绍文字 */}
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold text-text-primary mb-4">
                丁鹏翔
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                一个学生开发者，利用 AI 和自己的代码，不断建造属于自己的数字世界。
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                我热衷于动手落地各类想法，是偏爱实操的实践发烧友，想到创意就会尽全力亲手实现。日常离不开咖啡，习惯伴着咖啡钻研折腾各类项目。做事执行力强，崇尚亲身实操，不局限于空想，乐于在实践里摸索钻研。
              </p>
              <p className="text-text-secondary leading-relaxed">
                我也不知道我想成为一个怎么样的开发者，大概是不断把脑子里有趣的想法实现，不断钻研的吧。
              </p>
            </div>
          </div>
        </motion.section>

        {/* 技术方向 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">技术方向</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map(cat => {
              const Icon = cat.icon
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

        {/* 成长路线 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">成长路线</h2>
          <div className="relative pl-8">
            {/* 时间线竖线 */}
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-bg-primary" />
                  <span className="text-xs text-accent font-medium">{item.period}</span>
                  <h3 className="text-base font-semibold text-text-primary mt-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-6 pl-8">以上时间线基于GitHub记录整理，待你补充更多经历。</p>
        </motion.section>

        {/* AI协作介绍 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
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
                  【AI协作介绍待补充，描述你如何与AI工具协作开发、学习编程】
                </p>
                <p className="text-text-secondary leading-relaxed">
                  【具体案例待补充，如：使用AI辅助学习C++、用AI构建个人网站等】
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
                viewport={{ once: true }}
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
