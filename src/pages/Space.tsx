import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import {
  Coffee, Image, BookOpen, Cpu, Code2, Terminal, Globe,
  Award, GraduationCap, Wrench, Zap, MessageSquare, Home, User, Folder,
  FlaskConical, Mail, Star, Heart, Camera, Music, Video, Cloud,
  Database, Shield, Sun, Moon, Settings, FileText, Mic, Eye,
  ThumbsUp, PenTool, Layers, BarChart3, TrendingUp, Rocket, Package, Puzzle,
} from 'lucide-react'
import { useSpaceModules } from '../hooks/useSpaceModules'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Coffee, Image, BookOpen, Cpu, Code2, Terminal, Globe, Award, GraduationCap,
  Wrench, Zap, MessageSquare, Home, User, Folder, FlaskConical, Mail, Star,
  Heart, Camera, Music, Video, Cloud, Database, Shield, Sun, Moon, Settings,
  FileText, Mic, Eye, ThumbsUp, PenTool, Layers, BarChart3, TrendingUp,
  Rocket, Package, Puzzle,
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
}

export default function Space() {
  const { data: modules, isLoading } = useSpaceModules()

  if (isLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  const active = modules?.filter(m => m.active) ?? []

  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Personal Space</h1>
          <p className="text-text-secondary text-lg">这里记录代码之外的我</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {active.map((mod, index) => {
            const Icon = iconMap[mod.icon] || Coffee

            const CardContent = (
              <div className="p-6 flex flex-col items-center text-center justify-center min-h-[200px]">
                <div className="p-4 bg-accent/10 rounded-2xl mb-4">
                  <Icon size={32} className="text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{mod.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{mod.description}</p>
              </div>
            )

            const className = `group block bg-bg-secondary border border-border rounded-2xl hover:border-accent/50 transition-all hover:-translate-y-1 ${mod.route ? 'cursor-pointer' : 'opacity-50 cursor-default'}`

            return (
              <motion.div
                key={mod.id}
                {...fadeInUp}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {mod.route ? (
                  mod.route.startsWith('/') ? (
                    <Link to={mod.route} className={className}>
                      {CardContent}
                    </Link>
                  ) : (
                    <a href={mod.route} target="_blank" rel="noopener noreferrer" className={className}>
                      {CardContent}
                    </a>
                  )
                ) : (
                  <div className={className}>
                    {CardContent}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {active.length === 0 && (
          <p className="text-center text-text-secondary py-12">暂无启用的模块</p>
        )}
      </div>
    </div>
  )
}
