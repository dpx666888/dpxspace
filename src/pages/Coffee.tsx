import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Coffee as CoffeeIcon, MapPin, PenTool, Droplets, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCoffeeLogs } from '../hooks/useCoffeeLogs'
import type { CoffeeLogData } from '../types/database'

const ratingStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
}

function CoffeeDetail({ item, isOpen, onToggle }: { item: CoffeeLogData; isOpen: boolean; onToggle: () => void }) {
  const params = item.parameters || {}

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      {item.image_url && (
        <div className="aspect-video bg-bg-primary overflow-hidden">
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-text-primary text-lg">{item.title}</h3>
            <p className="text-sm text-text-secondary mt-0.5">{item.date}</p>
          </div>
          <span className="text-yellow-400 text-sm shrink-0">{ratingStars(item.rating)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {item.bean && <span className="inline-flex items-center gap-1 text-xs text-accent px-2 py-1 bg-accent/10 rounded-full"><CoffeeIcon size={12} />{item.bean}</span>}
          {item.origin && <span className="inline-flex items-center gap-1 text-xs text-text-secondary px-2 py-1 bg-bg-primary border border-border rounded-full"><MapPin size={12} />{item.origin}</span>}
          {item.process_method && <span className="inline-flex items-center gap-1 text-xs text-text-secondary px-2 py-1 bg-bg-primary border border-border rounded-full"><PenTool size={12} />{item.process_method}</span>}
          {item.equipment && <span className="inline-flex items-center gap-1 text-xs text-text-secondary px-2 py-1 bg-bg-primary border border-border rounded-full"><Droplets size={12} />{item.equipment}</span>}
        </div>

        {item.flavor_notes && (
          <p className="text-sm text-text-secondary mb-2 italic">"{item.flavor_notes}"</p>
        )}

        <button
          onClick={onToggle}
          className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"
        >
          {isOpen ? <><ChevronUp size={14} /> 收起详情</> : <><ChevronDown size={14} /> 查看详情</>}
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-border space-y-4"
          >
            {Object.keys(params).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">冲煮参数</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(params).map(([key, val]) => (
                    <div key={key} className="bg-bg-primary border border-border rounded-lg px-3 py-2">
                      <p className="text-xs text-text-secondary">{key}</p>
                      <p className="text-sm text-text-primary font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.description && (
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">制作过程与感受</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function Coffee() {
  const { data: items, isLoading } = useCoffeeLogs()
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  const count = items?.length ?? 0
  const avgRating = count > 0 ? (items!.reduce((sum, i) => sum + i.rating, 0) / count).toFixed(1) : '-'
  const beans = [...new Set(items?.map(i => i.bean).filter(Boolean) ?? [])]

  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <motion.div className="mb-12" {...fadeInUp}>
          <div className="flex items-center gap-2 mb-4">
            <Link to="/space" className="text-sm text-text-secondary hover:text-accent transition-colors">Personal Space</Link>
            <span className="text-text-secondary/30">/</span>
            <span className="text-sm text-accent">Coffee Lab</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">Coffee Lab</h1>
          <p className="text-text-secondary mb-6">我的咖啡探索记录</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-accent">{count}</p>
              <p className="text-xs text-text-secondary mt-1">累计制作</p>
            </div>
            <div className="bg-bg-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-accent">{avgRating}</p>
              <p className="text-xs text-text-secondary mt-1">平均评分</p>
            </div>
            <div className="bg-bg-secondary border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-accent">{beans.length}</p>
              <p className="text-xs text-text-secondary mt-1">尝试豆种</p>
            </div>
          </div>
        </motion.div>

        {items && items.length > 0 ? (
          <div className="space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                {...fadeInUp}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <CoffeeDetail item={item} isOpen={expandedId === item.id} onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary">
            <CoffeeIcon size={48} className="mx-auto mb-4 opacity-30" />
            <p>暂无咖啡记录</p>
            <p className="text-sm mt-2">开始记录你的第一杯咖啡</p>
          </div>
        )}
      </div>
    </div>
  )
}
