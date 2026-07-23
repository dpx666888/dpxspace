import { useState, useRef } from 'react'
import { Loader2, Plus, Trash2, GripVertical, Edit3, Save, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useAiCollabs } from '../../hooks/useAiCollabs'
import { createAiCollab, updateAiCollab, deleteAiCollab, updateAiCollabsOrder } from '../../services/aiCollab.service'
import type { AiCollabData, AiCollabInput } from '../../types/database'

const EMPTY: AiCollabInput = {
  date: '',
  title: '',
  context: '',
  prompt: '',
  result: '',
  project: '',
  sort_order: 0,
}

export default function CollabManage() {
  const { data: collabs, isLoading } = useAiCollabs()
  const qc = useQueryClient()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<AiCollabInput>(EMPTY)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const createMutation = useMutation({
    mutationFn: createAiCollab,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aiCollabs'] }),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AiCollabInput> }) => updateAiCollab(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['aiCollabs'] }); setEditingId(null) },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAiCollab,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aiCollabs'] }),
  })
  const orderMutation = useMutation({
    mutationFn: updateAiCollabsOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['aiCollabs'] }),
  })

  const startEdit = (collab: AiCollabData) => {
    setEditingId(collab.id)
    setEditData({
      date: collab.date,
      title: collab.title,
      context: collab.context,
      prompt: collab.prompt,
      result: collab.result,
      project: collab.project ?? '',
      sort_order: collab.sort_order,
    })
  }

  const cancelEdit = () => { setEditingId(null); setEditData(EMPTY) }

  const saveEdit = () => {
    if (editingId === 0) {
      createMutation.mutate(editData)
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, data: editData })
    }
  }

  const moveItem = (from: number, to: number) => {
    if (!collabs) return
    const list = [...collabs]
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    const items = list.map((item, idx) => ({ id: item.id, sort_order: idx + 1 }))
    orderMutation.mutate(items)
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'
  const pending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || orderMutation.isPending

  if (isLoading) {
    return (
      <AdminLayout title="协作记录管理">
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="协作记录管理">
      <div className="space-y-4 max-w-4xl">
        {pending && (
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> 正在保存...
          </div>
        )}

        {collabs?.map((collab, index) => (
          <div
            key={collab.id}
            draggable
            onDragStart={() => { setDragIndex(index); dragRef.current = { from: index, to: index } }}
            onDragOver={(e) => { e.preventDefault(); setDropIndex(index); if (dragRef.current) dragRef.current.to = index }}
            onDrop={() => {
              if (dragRef.current && dragRef.current.from !== dragRef.current.to) {
                moveItem(dragRef.current.from, dragRef.current.to)
              }
              setDragIndex(null); setDropIndex(null); dragRef.current = null
            }}
            className={`bg-bg-secondary border border-border rounded-xl p-4 transition-colors ${
              dragIndex === index ? 'opacity-50 border-dashed border-accent' : dropIndex === index ? 'border-accent' : ''
            }`}
          >
            {editingId === collab.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">日期</label>
                    <input value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">关联项目</label>
                    <input value={editData.project ?? ''} onChange={e => setEditData({ ...editData, project: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">标题</label>
                  <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">使用场景</label>
                  <textarea value={editData.context} onChange={e => setEditData({ ...editData, context: e.target.value })} rows={2} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Prompt</label>
                  <textarea value={editData.prompt} onChange={e => setEditData({ ...editData, prompt: e.target.value })} rows={2} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">结果</label>
                  <textarea value={editData.result} onChange={e => setEditData({ ...editData, result: e.target.value })} rows={2} className={inputClass} />
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-light"><Save size={14} /> 保存</button>
                  <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-primary"><X size={14} /> 取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 pt-0.5 shrink-0">
                  <GripVertical size={14} className="text-text-secondary cursor-grab" />
                  <span className="text-xs text-text-secondary w-4">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text-primary text-sm">{collab.title}</h3>
                    {collab.project && <span className="text-xs text-accent px-1.5 py-0.5 bg-accent/10 rounded-full shrink-0">{collab.project}</span>}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{collab.context}</p>
                  <span className="text-xs text-text-secondary/50 mt-1 inline-block">{collab.date}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => startEdit(collab)} className="p-1.5 text-text-secondary hover:text-accent"><Edit3 size={14} /></button>
                  <button type="button" onClick={() => deleteMutation.mutate(collab.id)} className="p-1.5 text-text-secondary hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editingId === 0 ? (
          <div className="bg-bg-secondary border border-dashed border-accent/50 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-secondary mb-1">日期</label>
                <input value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">关联项目</label>
                <input value={editData.project ?? ''} onChange={e => setEditData({ ...editData, project: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">标题</label>
              <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">使用场景</label>
              <textarea value={editData.context} onChange={e => setEditData({ ...editData, context: e.target.value })} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Prompt</label>
              <textarea value={editData.prompt} onChange={e => setEditData({ ...editData, prompt: e.target.value })} rows={2} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">结果</label>
              <textarea value={editData.result} onChange={e => setEditData({ ...editData, result: e.target.value })} rows={2} className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-light"><Save size={14} /> 保存</button>
              <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-primary"><X size={14} /> 取消</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => { setEditingId(0); setEditData({ ...EMPTY, sort_order: (collabs?.length ?? 0) + 1 }) }} className="w-full py-3 border border-dashed border-border rounded-xl text-text-secondary hover:text-accent hover:border-accent/50 transition-colors text-sm inline-flex items-center justify-center gap-1">
            <Plus size={14} /> 新增协作记录
          </button>
        )}
      </div>
    </AdminLayout>
  )
}
