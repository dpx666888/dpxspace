import { motion } from 'framer-motion'
import { Code2, Terminal, BookOpen, Zap, Globe, MessageSquare, Award, GraduationCap, Cpu, Wrench } from 'lucide-react'
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
    skills: ['Vue', 'React', 'uni-app'],
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
    period: '2024.09',
    title: '入学 中山职业技术学院',
    desc: '物联网应用技术专业，开启专业学习之路。',
  },
  {
    period: '2024',
    title: '校级二等奖学金',
    desc: '学业成绩优异，专业排名前10%。',
  },
  {
    period: '2025',
    title: '计算机设计大赛粤港澳大湾区二等奖',
    desc: '参赛作品聚焦物联网应用领域，负责核心模块开发。',
  },
  {
    period: '2025',
    title: '挑战杯校级三等奖',
    desc: '团队协作完成创新项目。',
  },
  {
    period: '2026.05',
    title: '注册 GitHub 账号',
    desc: '开启代码托管与开源之旅。',
  },
  {
    period: '2026.05',
    title: 'AixProbe 嵌入式调试器复刻',
    desc: '基于全志 T113-S3 芯片的硬件项目实践。',
  },
  {
    period: '2026.05',
    title: '螃蟹记账小程序开发',
    desc: '独立开发跨平台记账应用。',
  },
  {
    period: '2026.07',
    title: '搭建个人电子名片网站',
    desc: '使用 React + Tailwind CSS 构建个人主页。',
  },
]

const experiences = [
  {
    icon: Wrench,
    title: '螃蟹记账 — 跨平台记账小程序',
    role: '独立开发',
    desc: '独立完成个人日常收支管理需求分析、UI 设计与全栈开发。基于 uni-app + Vue 3 框架，实现 Android/iOS/H5/微信小程序多端适配。涵盖用户注册登录与多账号管理、收支记录管理（9类支出、4类收入）、首页仪表盘、分类统计图表、Excel/CSV/JSON 多格式数据导出与导入。',
  },
  {
    icon: Cpu,
    title: 'AixProbe 嵌入式 AI 远程调试器复刻',
    role: '独立开发者',
    desc: '基于嘉立创开源 AixProbe 方案，采用全志 T113-S3 主控芯片，独立完成元器件选型、PCB 手工焊接与硬件电路全流程调试；排查解决电源短路、串口通信异常、芯片引脚虚焊等典型硬件故障，最终产出可稳定运行的硬件样机。',
  },
  {
    icon: Award,
    title: '第十八届中国大学生计算机设计大赛',
    role: '核心开发',
    desc: '参赛作品聚焦物联网应用领域，负责项目核心模块开发与功能调试，作品通过赛区专家评审，荣获粤港澳大湾区赛区决赛二等奖。',
  },
]

const certificates = [
  { name: '传感网应用开发职业技能等级证书（中级）', icon: Award },
  { name: 'C1 驾驶证', icon: Award },
  { name: '校级二等奖学金', icon: GraduationCap },
  { name: '优秀学生干部骨干', icon: GraduationCap },
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

        {/* 教育经历 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">教育经历</h2>
          <div className="p-6 bg-bg-secondary border border-border rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">中山职业技术学院</h3>
                <p className="text-text-secondary">物联网应用技术</p>
              </div>
              <span className="text-sm text-accent shrink-0">2024.09 - 至今</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary"><span className="text-text-primary">主修课程：</span>C语言、单片机、模电、数电</p>
              <p className="text-sm text-text-secondary"><span className="text-text-primary">学业成绩：</span>专业排名前10%，获校级二等奖学金、优秀学生干部骨干</p>
              <p className="text-sm text-text-secondary"><span className="text-text-primary">竞赛荣誉：</span>计算机设计大赛粤港澳大湾区决赛二等奖、挑战杯校级三等奖</p>
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

        {/* 实践经历 */}
        <motion.section className="mb-20 md:mb-28" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-8">实践经历</h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => {
              const Icon = exp.icon
              return (
                <motion.div
                  key={index}
                  className="p-6 bg-bg-secondary border border-border rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
            {certificates.map((cert, index) => {
              const Icon = cert.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-bg-secondary border border-border rounded-xl"
                >
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <span className="text-sm text-text-primary">{cert.name}</span>
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
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
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
