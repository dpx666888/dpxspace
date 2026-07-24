import { useState, useRef } from 'react'
import { Loader2, GripVertical, Edit3, Save, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import IconPicker from '../components/IconPicker'
import { useSpaceModules } from '../../hooks/useSpaceModules'
import { updateSpaceModule, reorderSpaceModules } from '../../services/spaceModules.service'
import type { SpaceModule } from '../../types/database'

export default function SpaceModulesManage() {
  const { data: modules, isLoading } = useSpaceModules()
  const qc = useQueryClient()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<{ title: string; description: string; icon: string; route: string; active: boolean }>({ title: '', description: '', icon: 'Coffee', route: '', active: true })
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SpaceModule> }) => updateSpaceModule(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['spaceModules'] }); setEditingId(null) },
  })
  const orderMutation = useMutation({
    mutationFn: reorderSpaceModules,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['spaceModules'] }),
  })

  const startEdit = (mod: SpaceModule) => {
    setEditingId(mod.id)
    setEditData({ title: mod.title, description: mod.description, icon: mod.icon, route: mod.route, active: mod.active })
  }

  const saveEdit = () => {
    if (editingId) updateMutation.mutate({ id: editingId, data: editData })
  }

  const move = (from: number, to: number) => {
    if (!modules) return
    const list = [...modules]
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    orderMutation.mutate(list.map((m, idx) => ({ id: m.id, sort_order: idx + 1 })))
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'

  if (isLoading) {
    return <AdminLayout title="个人空间配置"><div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div></AdminLayout>
  }

  return (
    <AdminLayout title="个人空间配置">
      <div className="space-y-3 max-w-3xl">
        <p className="text-text-secondary text-sm mb-4">管理个人空间的模块卡片，拖动调整顺序</p>

        {modules?.map((mod, index) => (
          <div
            key={mod.id}
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
            {editingId === mod.id ? (
              <div className="space-y-3 cursor-default">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">标题</label>
                    <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">路由</label>
                    <input value={editData.route} onChange={e => setEditData({ ...editData, route: e.target.value })} className={inputClass} placeholder="/space/xxx" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">描述</label>
                  <input value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">图标</label>
                    <IconPicker value={editData.icon} onChange={icon => setEditData({ ...editData, icon })} />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                      <input type="checkbox" checked={editData.active} onChange={e => setEditData({ ...editData, active: e.target.checked })} className="w-4 h-4 accent-accent" />
                      已启用
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={saveEdit} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent-light"><Save size={14} /> 保存</button>
                  <button onClick={() => setEditingId(null)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-border text-text-primary text-sm rounded-lg hover:bg-bg-primary"><X size={14} /> 取消</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 shrink-0">
                  <GripVertical size={14} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary w-4">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-text-primary text-sm">{mod.title}</h3>
                    {!mod.active && <span className="text-xs text-text-secondary/50 px-1.5 py-0.5 bg-bg-primary rounded">未启用</span>}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{mod.description}</p>
                  {mod.route && <span className="text-xs text-accent mt-0.5 inline-block">{mod.route}</span>}
                </div>
                <button onClick={() => startEdit(mod)} className="p-1.5 text-text-secondary hover:text-accent shrink-0"><Edit3 size={14} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
