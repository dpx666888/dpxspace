import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Code2, GitBranch, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const projects = [
  {
    name: '100-Days-of-C-Learning',
    desc: '一个用来学习 C++ 的仓库，记录百日编程学习历程。',
    lang: 'C++',
    url: 'https://github.com/dpx666888/100-Days-of-C-Learning',
    icon: Code2,
  },
  {
    name: 'Git-Learning',
    desc: 'Git 版本控制学习笔记，从基础到进阶。',
    lang: 'Git',
    url: 'https://github.com/dpx666888/Git-Learning',
    icon: GitBranch,
  },
  {
    name: '-app',
    desc: '基于 Vue 的应用项目，持续迭代中。',
    lang: 'Vue',
    url: 'https://github.com/dpx666888/-app',
    icon: Globe,
  },
]

const skills = ['C++', 'Vue', 'uni-app', 'Git', 'React', 'TypeScript', 'Tailwind CSS']

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center px-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <motion.p
            className="text-accent text-sm md:text-base font-medium mb-4"
            {...fadeInUp}
            transition={{ duration: 0.5 }}
          >
            你好，我是
          </motion.p>
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-text-primary mb-6"
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            丁鹏翔
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-text-secondary max-w-2xl mb-4"
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            一个学生开发者，利用 AI 和自己的代码，不断建造属于自己的数字世界。
          </motion.p>
          <motion.div
            className="flex items-center gap-4 mt-8"
            {...fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
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
            {projects.map((project, index) => {
              const Icon = project.icon
              return (
                <motion.a
                  key={project.name}
                  href={project.url}
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
                      {project.lang}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {project.desc}
                  </p>
                </motion.a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
