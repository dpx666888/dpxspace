import { useState, useRef } from 'react'
import { Loader2, Plus, Trash2, GripVertical, Edit3, Save, X, Upload, Image } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useGallery } from '../../hooks/useGallery'
import { createGalleryItem, updateGalleryItem, deleteGalleryItem, reorderGallery, uploadImage, deleteImage } from '../../services/gallery.service'
import type { GalleryInput, GalleryItem } from '../../types/database'

const CATEGORIES = ['项目过程', 'UI设计', 'AI协作', '生活记录']
const EMPTY: GalleryInput = { title: '', description: '', image_url: '', category: '生活记录', related_type: '', related_id: null, date: '', sort_order: 0 }

export default function GalleryManage() {
  const { data: items, isLoading } = useGallery()
  const qc = useQueryClient()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<GalleryInput>(EMPTY)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const createMutation = useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<GalleryInput> }) => updateGalleryItem(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['gallery'] }); setEditingId(null) },
  })
  const deleteMutation = useMutation({
    mutationFn: async (item: { id: number; image_url: string }) => {
      if (item.image_url) await deleteImage(item.image_url).catch(() => {})
      await deleteGalleryItem(item.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })
  const orderMutation = useMutation({
    mutationFn: reorderGallery,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setEditData({ ...editData, image_url: url })
    } catch (err) { alert('上传失败') }
    setUploading(false)
  }

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setEditData({ title: item.title, description: item.description, image_url: item.image_url, category: item.category, related_type: item.related_type, related_id: item.related_id, date: item.date, sort_order: item.sort_order })
  }

  const cancelEdit = () => { setEditingId(null); setEditData(EMPTY) }

  const saveEdit = () => {
    if (editingId === 0) createMutation.mutate(editData)
    else if (editingId) updateMutation.mutate({ id: editingId, data: editData })
  }

  const move = (from: number, to: number) => {
    if (!items) return
    const list = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    orderMutation.mutate(list.map((it, idx) => ({ id: it.id, sort_order: idx + 1 })))
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || orderMutation.isPending

  if (isLoading) {
    return (
      <AdminLayout title="视觉档案管理">
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  const sorted = items ? [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : []

  return (
    <AdminLayout title="视觉档案管理">
      <div className="space-y-4 max-w-5xl">
        {pending && <div className="flex items-center gap-2 text-text-secondary text-sm"><Loader2 className="w-4 h-4 animate-spin" /> 正在保存...</div>}

        {sorted.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => { setDragIndex(index); dragRef.current = { from: index, to: index } }}
            onDragOver={(e) => { e.preventDefault(); setDropIndex(index); if (dragRef.current) dragRef.current.to = index }}
            onDrop={() => {
              if (dragRef.current && dragRef.current.from !== dragRef.current.to) move(dragRef.current.from, dragRef.current.to)
              setDragIndex(null); setDropIndex(null); dragRef.current = null
            }}
            className={`bg-bg-secondary border border-border rounded-xl p-4 transition-colors cursor-grab ${
              dragIndex === index ? 'opacity-50 border-dashed border-accent' : dropIndex === index ? 'border-accent' : ''
            }`}
          >
            {editingId === item.id ? (
              <div className="space-y-3 cursor-default">
                <div className="flex gap-4">
                  <div className="w-32 h-24 shrink-0 bg-bg-primary border border-border rounded-lg overflow-hidden">
                    {editData.image_url ? <img src={editData.image_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-text-secondary/50"><Image size={24} /></div>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} placeholder="标题" />
                    <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} rows={2} className={inputClass} placeholder="描述" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">分类</label>
                    <select value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} className={inputClass}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">关联类型</label>
                    <input value={editData.related_type ?? ''} onChange={e => setEditData({ ...editData, related_type: e.target.value })} className={inputClass} placeholder="project/coffee/log" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">日期</label>
                    <input value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className={inputClass} />
                  </div>
                  <div className="flex items-end gap-2">
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2 border border-border rounded-lg text-text-secondary hover:text-accent text-sm flex items-center gap-1">
                      <Upload size={14} /> {uploading ? '...' : '上传'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-light"><Save size={14} /> 保存</button>
                  <button onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-primary"><X size={14} /> 取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 pt-0.5 shrink-0">
                  <GripVertical size={14} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary w-4">{index + 1}</span>
                </div>
                <div className="w-20 h-16 shrink-0 bg-bg-primary border border-border rounded-lg overflow-hidden">
                  {item.image_url ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-text-secondary/30"><Image size={20} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-primary text-sm">{item.title || '未命名'}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mt-0.5">{item.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-accent px-1.5 py-0.5 bg-accent/10 rounded-full">{item.category}</span>
                    {item.date && <span className="text-xs text-text-secondary/50">{item.date}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(item)} className="p-1.5 text-text-secondary hover:text-accent"><Edit3 size={14} /></button>
                  <button onClick={() => { if (confirm('确定删除？')) deleteMutation.mutate({ id: item.id, image_url: item.image_url }) }} className="p-1.5 text-text-secondary hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === 0 ? (
          <div className="bg-bg-secondary border border-dashed border-accent/50 rounded-xl p-4 space-y-3">
            <div className="flex gap-4">
              <div className="w-32 h-24 shrink-0 bg-bg-primary border border-border rounded-lg overflow-hidden">
                {editData.image_url ? <img src={editData.image_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-text-secondary/50"><Image size={24} /></div>}
              </div>
              <div className="flex-1 space-y-2">
                <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} placeholder="标题" />
                <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} rows={2} className={inputClass} placeholder="描述" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">分类</label>
                <select value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">关联类型</label>
                <input value={editData.related_type ?? ''} onChange={e => setEditData({ ...editData, related_type: e.target.value })} className={inputClass} placeholder="project/coffee/log" />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">日期</label>
                <input value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className={inputClass} />
              </div>
              <div className="flex items-end gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-2 border border-border rounded-lg text-text-secondary hover:text-accent text-sm flex items-center gap-1">
                  <Upload size={14} /> {uploading ? '...' : '上传'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-light"><Save size={14} /> 保存</button>
              <button onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-primary"><X size={14} /> 取消</button>
            </div>
          </div>
        ) : (
          <button onClick={() => { setEditingId(0); setEditData({ ...EMPTY, sort_order: (items?.length ?? 0) + 1 }) }} className="w-full py-3 border border-dashed border-border rounded-xl text-text-secondary hover:text-accent hover:border-accent/50 transition-colors text-sm inline-flex items-center justify-center gap-1">
            <Plus size={14} /> 新增图片
          </button>
        )}
      </div>
    </AdminLayout>
  )
}
