import { motion } from 'framer-motion'
import { ArrowRight, Loader2, Coffee, Image, BookOpen, Cpu, Star, Heart, Camera, Music, Mic } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSpaceModules } from '../hooks/useSpaceModules'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Coffee, Image, BookOpen, Cpu, Star, Heart, Camera, Music, Mic,
}

export default function PersonalSpacePreview() {
  const { data: modules, isLoading } = useSpaceModules()
  const active = modules?.filter(m => m.active) ?? []

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (active.length === 0) return null

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">Personal Space</h2>
            <p className="text-text-secondary text-sm mt-2">探索代码之外的我</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/space"
              className="text-accent text-sm hover:text-accent-light transition-colors inline-flex items-center gap-1"
            >
              进入空间 <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.map((mod, index) => {
            const Icon = iconMap[mod.icon] || Coffee
            return (
              <motion.div
                key={mod.id}
                className="group p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 transition-all hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <h3 className="font-semibold text-text-primary">{mod.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{mod.description}</p>
                {mod.route ? (
                  <Link
                    to={mod.route}
                    className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light transition-colors"
                  >
                    探索 <ArrowRight size={12} />
                  </Link>
                ) : (
                  <span className="text-xs text-text-secondary/50">即将上线</span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
