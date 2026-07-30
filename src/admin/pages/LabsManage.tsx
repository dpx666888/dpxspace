import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useLabs } from '../../hooks/useLabs'
import { useDeleteLab } from '../hooks/useLabMutations'
import { reorderLabs } from '../../services/labs.service'

export default function LabsManage() {
  const { data: labs, isLoading } = useLabs()
  const deleteLab = useDeleteLab()
  const qc = useQueryClient()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)

  const orderMutation = useMutation({
    mutationFn: reorderLabs,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['labs'] }),
  })

  const sorted = labs ? [...labs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : []

  const move = (from: number, to: number) => {
    const list = [...sorted]
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    orderMutation.mutate(list.map((item, idx) => ({ id: item.id, sort_order: idx + 1 })))
  }

  return (
    <AdminLayout title="实验室管理">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">实验列表</h2>
        <Link to="/admin/labs/new/edit" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors">
          <Plus size={16} /> 新建实验
        </Link>
      </div>

      {isLoading ? (
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      ) : (
        <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-primary border-b border-border">
              <tr>
                <th className="px-3 py-3 font-medium text-text-primary w-10">#</th>
                <th className="px-4 py-3 font-medium text-text-primary">标题</th>
                <th className="px-4 py-3 font-medium text-text-primary">类型</th>
                <th className="px-4 py-3 font-medium text-text-primary">状态</th>
                <th className="px-4 py-3 font-medium text-text-primary text-right">操作</th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-border"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragRef.current && dragRef.current.from !== dragRef.current.to) {
                  move(dragRef.current.from, dragRef.current.to)
                }
                setDragIndex(null); setDropIndex(null); dragRef.current = null
              }}
            >
              {sorted.map((lab, index) => (
                <tr
                  key={lab.id}
                  draggable
                  onDragStart={() => { setDragIndex(index); dragRef.current = { from: index, to: index } }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDropIndex(index); if (dragRef.current) dragRef.current.to = index }}
                  className={`hover:bg-bg-primary/50 transition-colors cursor-grab active:cursor-grabbing ${
                    dragIndex === index ? 'opacity-50 bg-accent/5' : dropIndex === index ? 'bg-accent/10' : ''
                  }`}
                >
                  <td className="px-3 py-3 text-text-secondary">
                    <GripVertical size={14} className="inline" />
                  </td>
                  <td className="px-4 py-3 text-text-primary">{lab.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{lab.type}</td>
                  <td className="px-4 py-3 text-text-secondary">{lab.status}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link to={`/admin/labs/${lab.id}/edit`} className="p-2 text-text-secondary hover:text-accent transition-colors" title="编辑"><Pencil size={16} /></Link>
                      <button
                        onClick={() => { if (confirm(`确定删除实验「${lab.title}」吗？`)) deleteLab.mutate(lab.id) }}
                        disabled={deleteLab.isPending}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50" title="删除"
                      ><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
