import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useLogs } from '../../hooks/useLogs'
import { useDeleteLog } from '../hooks/useLogMutations'
import { reorderLogs } from '../../services/logs.service'

export default function LogsManage() {
  const { data: logs, isLoading } = useLogs()
  const deleteLog = useDeleteLog()
  const qc = useQueryClient()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const orderMutation = useMutation({
    mutationFn: reorderLogs,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['logs'] }),
  })

  const sorted = logs ? [...logs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : []

  const move = (from: number, to: number) => {
    const list = [...sorted]
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    orderMutation.mutate(list.map((item, idx) => ({ id: item.id, sort_order: idx + 1 })))
  }

  return (
    <AdminLayout title="成长日志管理">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">日志列表</h2>
        <Link to="/admin/logs/new" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors">
          <Plus size={16} /> 新建日志
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
                <th className="px-4 py-3 font-medium text-text-primary">日期</th>
                <th className="px-4 py-3 font-medium text-text-primary">分类</th>
                <th className="px-4 py-3 font-medium text-text-primary text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((log, index) => (
                <tr
                  key={log.id}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => { e.preventDefault(); setDropIndex(index) }}
                  onDragEnd={() => {
                    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) move(dragIndex, dropIndex)
                    setDragIndex(null); setDropIndex(null)
                  }}
                  className={`hover:bg-bg-primary/50 transition-colors cursor-grab active:cursor-grabbing ${
                    dragIndex === index ? 'opacity-50 bg-accent/5' : dropIndex === index ? 'bg-accent/10' : ''
                  }`}
                >
                  <td className="px-3 py-3 text-text-secondary">
                    <GripVertical size={14} className="inline" />
                  </td>
                  <td className="px-4 py-3 text-text-primary">{log.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{log.date}</td>
                  <td className="px-4 py-3 text-text-secondary">{log.category}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link to={`/admin/logs/${log.id}/edit`} className="p-2 text-text-secondary hover:text-accent transition-colors" title="编辑"><Pencil size={16} /></Link>
                      <button
                        onClick={() => { if (confirm(`确定删除日志「${log.title}」吗？`)) deleteLog.mutate(log.id) }}
                        disabled={deleteLog.isPending}
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
