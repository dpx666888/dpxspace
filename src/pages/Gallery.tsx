import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Image } from 'lucide-react'
import { useGallery } from '../hooks/useGallery'
import type { GalleryItem } from '../types/database'

const CATEGORIES = ['全部', '项目过程', 'UI设计', 'AI协作', '生活记录']

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' },
  transition: { duration: 0.4 },
}

export default function Gallery() {
  const [category, setCategory] = useState('全部')
  const { data: items, isLoading } = useGallery(category === '全部' ? undefined : category)
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  if (isLoading) {
    return (
      <div className="pt-16 px-4 md:px-8 py-16 md:py-24 min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-16 px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">视觉档案</h1>
          <p className="text-text-secondary mb-8">记录开发过程中的视觉片段和灵感碎片</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                category === cat
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {items && items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="group cursor-pointer bg-bg-secondary border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-all hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelected(item)}
              >
                <div className="aspect-square bg-bg-primary overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-secondary/30"><Image size={40} /></div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-text-primary text-sm truncate">{item.title || '未命名'}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-accent px-1.5 py-0.5 bg-accent/10 rounded-full">{item.category}</span>
                    {item.date && <span className="text-xs text-text-secondary/50">{item.date}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-secondary">
            <Image size={48} className="mx-auto mb-4 opacity-30" />
            <p>暂无图片</p>
          </div>
        )}

        {/* 图片详情弹窗 */}
        {selected && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-bg-secondary border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
              {selected.image_url && (
                <img src={selected.image_url} alt={selected.title} className="w-full max-h-[60vh] object-contain bg-bg-primary" />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-2">{selected.title}</h2>
                <p className="text-text-secondary leading-relaxed mb-4">{selected.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-accent px-2 py-1 bg-accent/10 rounded-full">{selected.category}</span>
                  {selected.date && <span className="text-sm text-text-secondary">{selected.date}</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
