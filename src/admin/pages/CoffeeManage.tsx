import { useState, useRef } from 'react'
import { Loader2, Plus, Trash2, GripVertical, Edit3, Save, X, Upload, Image } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useCoffeeLogs } from '../../hooks/useCoffeeLogs'
import { createCoffeeLog, updateCoffeeLog, deleteCoffeeLog, reorderCoffeeLogs } from '../../services/coffee.service'
import { uploadImage, deleteImage } from '../../services/gallery.service'
import type { CoffeeLogInput, CoffeeLogData } from '../../types/database'

const EMPTY: CoffeeLogInput = {
  title: '', date: '', bean: '', origin: '', process_method: '', equipment: '',
  parameters: {}, description: '', flavor_notes: '', image_url: '', storage_path: '', rating: 3, sort_order: 0,
}

const ratingStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function CoffeeManage() {
  const { data: items, isLoading } = useCoffeeLogs()
  const qc = useQueryClient()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<CoffeeLogInput>(EMPTY)
  const [paramText, setParamText] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const createMutation = useMutation({ mutationFn: createCoffeeLog, onSuccess: () => qc.invalidateQueries({ queryKey: ['coffeeLogs'] }) })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CoffeeLogInput> }) => updateCoffeeLog(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['coffeeLogs'] }); setEditingId(null) },
  })
  const deleteMutation = useMutation({
    mutationFn: async (item: { id: number; storage_path: string }) => {
      if (item.storage_path) await deleteImage(item.storage_path).catch(() => {})
      await deleteCoffeeLog(item.id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coffeeLogs'] }),
  })
  const orderMutation = useMutation({ mutationFn: reorderCoffeeLogs, onSuccess: () => qc.invalidateQueries({ queryKey: ['coffeeLogs'] }) })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { const result = await uploadImage(file, 'coffee'); setEditData({ ...editData, image_url: result.url, storage_path: result.path }) } catch { alert('上传失败') }
    setUploading(false)
  }

  const startEdit = (item: CoffeeLogData) => {
    setEditingId(item.id)
    setEditData({
      title: item.title, date: item.date, bean: item.bean, origin: item.origin,
      process_method: item.process_method, equipment: item.equipment,
      parameters: item.parameters, description: item.description,
      flavor_notes: item.flavor_notes, image_url: item.image_url, storage_path: item.storage_path,
      rating: item.rating, sort_order: item.sort_order,
    })
    setParamText(Object.entries(item.parameters || {}).map(([k, v]) => `${k}: ${v}`).join('\n'))
  }

  const cancelEdit = () => { setEditingId(null); setEditData(EMPTY); setParamText('') }

  const saveEdit = () => {
    const params: Record<string, string> = {}
    paramText.split('\n').forEach(line => {
      const [k, ...rest] = line.split(':')
      if (k.trim() && rest.length) params[k.trim()] = rest.join(':').trim()
    })
    const data = { ...editData, parameters: params }
    if (editingId === 0) createMutation.mutate(data)
    else if (editingId) updateMutation.mutate({ id: editingId, data })
  }

  const move = (from: number, to: number) => {
    if (!items) return
    const list = [...items]
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    orderMutation.mutate(list.map((m, idx) => ({ id: m.id, sort_order: idx + 1 })))
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'
  const sorted = items ? [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : []

  if (isLoading) {
    return <AdminLayout title="咖啡角管理"><div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div></AdminLayout>
  }

  return (
    <AdminLayout title="咖啡角管理">
      <div className="space-y-4 max-w-4xl">
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
                  <div className="w-24 h-24 shrink-0 bg-bg-primary border border-border rounded-lg overflow-hidden">
                    {editData.image_url ? <img src={editData.image_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-text-secondary/50"><Image size={20} /></div>}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} placeholder="咖啡名称" />
                    <input value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className={inputClass} placeholder="日期" />
                    <input value={editData.bean} onChange={e => setEditData({ ...editData, bean: e.target.value })} className={inputClass} placeholder="咖啡豆" />
                    <input value={editData.origin} onChange={e => setEditData({ ...editData, origin: e.target.value })} className={inputClass} placeholder="产地" />
                    <input value={editData.process_method} onChange={e => setEditData({ ...editData, process_method: e.target.value })} className={inputClass} placeholder="处理方式" />
                    <input value={editData.equipment} onChange={e => setEditData({ ...editData, equipment: e.target.value })} className={inputClass} placeholder="器具" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">参数（每行一个 key: value）</label>
                    <textarea value={paramText} onChange={e => setParamText(e.target.value)} rows={3} className={inputClass} placeholder="水温: 92°C&#10;粉水比: 1:15&#10;研磨度: 中细" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">风味</label>
                      <input value={editData.flavor_notes} onChange={e => setEditData({ ...editData, flavor_notes: e.target.value })} className={inputClass} placeholder="风味描述" />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-1">评分 {editData.rating}/5</label>
                      <input type="range" min="1" max="5" value={editData.rating} onChange={e => setEditData({ ...editData, rating: parseInt(e.target.value) })} className="w-full accent-accent" />
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-1.5 border border-border rounded-lg text-text-secondary hover:text-accent text-sm flex items-center gap-1">
                      <Upload size={14} /> {uploading ? '...' : '上传图片'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">描述</label>
                  <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} rows={2} className={inputClass} placeholder="制作过程和感受" />
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
                <div className="w-16 h-16 shrink-0 bg-bg-primary border border-border rounded-lg overflow-hidden">
                  {item.image_url ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-text-secondary/30"><Image size={16} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-text-primary text-sm">{item.title || '未命名'}</h3>
                    <span className="text-yellow-400 text-xs">{ratingStars(item.rating)}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{item.bean}{item.origin ? ` · ${item.origin}` : ''}{item.equipment ? ` · ${item.equipment}` : ''}</p>
                  <p className="text-xs text-text-secondary/70 mt-0.5 line-clamp-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(item)} className="p-1.5 text-text-secondary hover:text-accent"><Edit3 size={14} /></button>
                  <button onClick={() => { if (confirm('确定删除？')) deleteMutation.mutate({ id: item.id, storage_path: item.storage_path }) }} className="p-1.5 text-text-secondary hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === 0 ? (
          <div className="bg-bg-secondary border border-dashed border-accent/50 rounded-xl p-4 space-y-3">
            <div className="flex gap-4">
              <div className="w-24 h-24 shrink-0 bg-bg-primary border border-border rounded-lg overflow-hidden">
                {editData.image_url ? <img src={editData.image_url} alt="" className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-text-secondary/50"><Image size={20} /></div>}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} placeholder="咖啡名称" />
                <input value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className={inputClass} placeholder="日期" />
                <input value={editData.bean} onChange={e => setEditData({ ...editData, bean: e.target.value })} className={inputClass} placeholder="咖啡豆" />
                <input value={editData.origin} onChange={e => setEditData({ ...editData, origin: e.target.value })} className={inputClass} placeholder="产地" />
                <input value={editData.process_method} onChange={e => setEditData({ ...editData, process_method: e.target.value })} className={inputClass} placeholder="处理方式" />
                <input value={editData.equipment} onChange={e => setEditData({ ...editData, equipment: e.target.value })} className={inputClass} placeholder="器具" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">参数</label>
                <textarea value={paramText} onChange={e => setParamText(e.target.value)} rows={3} className={inputClass} placeholder="水温: 92°C&#10;粉水比: 1:15" />
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">风味</label>
                  <input value={editData.flavor_notes} onChange={e => setEditData({ ...editData, flavor_notes: e.target.value })} className={inputClass} placeholder="风味描述" />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">评分 {editData.rating}/5</label>
                  <input type="range" min="1" max="5" value={editData.rating} onChange={e => setEditData({ ...editData, rating: parseInt(e.target.value) })} className="w-full accent-accent" />
                </div>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-1.5 border border-border rounded-lg text-text-secondary hover:text-accent text-sm flex items-center gap-1">
                  <Upload size={14} /> {uploading ? '...' : '上传图片'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">描述</label>
              <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} rows={2} className={inputClass} placeholder="制作过程和感受" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-light"><Save size={14} /> 保存</button>
              <button onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-primary"><X size={14} /> 取消</button>
            </div>
          </div>
        ) : (
          <button onClick={() => { setEditingId(0); setEditData({ ...EMPTY, sort_order: (items?.length ?? 0) + 1 }); setParamText('') }} className="w-full py-3 border border-dashed border-border rounded-xl text-text-secondary hover:text-accent hover:border-accent/50 transition-colors text-sm inline-flex items-center justify-center gap-1">
            <Plus size={14} /> 新增咖啡记录
          </button>
        )}
      </div>
    </AdminLayout>
  )
}
