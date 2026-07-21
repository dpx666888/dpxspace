import { motion } from 'framer-motion'
import { Mail, Github, MapPin, Send } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function Contact() {
  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-12 md:mb-16" {...fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">联系方式</h1>
          <p className="text-text-secondary max-w-2xl">
            欢迎交流技术、项目合作或单纯聊聊天。你可以通过以下方式找到我。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 联系信息 */}
          <motion.div className="space-y-6" {...fadeInUp}>
            <div className="p-5 bg-bg-secondary border border-border rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">邮箱</p>
                  <a
                    href="mailto:email@example.com"
                    className="text-text-primary hover:text-accent transition-colors"
                  >
                    email@example.com
                  </a>
                  <p className="text-xs text-text-secondary mt-1">待补充真实邮箱</p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-bg-secondary border border-border rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <Github size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">GitHub</p>
                  <a
                    href="https://github.com/dpx666888"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary hover:text-accent transition-colors"
                  >
                    github.com/dpx666888
                  </a>
                </div>
              </div>
            </div>

            <div className="p-5 bg-bg-secondary border border-border rounded-xl">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-accent/10 rounded-lg">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">位置</p>
                  <p className="text-text-primary">【待补充】</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 留言表单 */}
          <motion.div className="p-6 bg-bg-secondary border border-border rounded-xl" {...fadeInUp}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Send size={16} className="text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">给我留言</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              表单功能待实现，目前仅作展示。请通过邮箱或GitHub联系。
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">姓名</label>
                <input
                  type="text"
                  disabled
                  placeholder="你的姓名"
                  className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">邮箱</label>
                <input
                  type="email"
                  disabled
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">留言内容</label>
                <textarea
                  disabled
                  rows={4}
                  placeholder="想对我说点什么..."
                  className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-secondary/50 disabled:opacity-50 resize-none"
                />
              </div>
              <button
                disabled
                className="w-full px-4 py-2.5 bg-accent text-white rounded-lg font-medium disabled:opacity-50 cursor-not-allowed"
              >
                发送留言（待实现）
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
