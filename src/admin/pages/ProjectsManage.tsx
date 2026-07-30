import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useProjects } from '../../hooks/useProjects'
import { useDeleteProject } from '../hooks/useProjectMutations'
import { reorderProjects } from '../../services/projects.service'

export default function ProjectsManage() {
  const { data: projects, isLoading } = useProjects()
  const deleteProject = useDeleteProject()
  const qc = useQueryClient()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)

  const orderMutation = useMutation({
    mutationFn: reorderProjects,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })

  const sorted = projects ? [...projects].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) : []

  const move = (from: number, to: number) => {
    const list = [...sorted]
    const [removed] = list.splice(from, 1)
    list.splice(to, 0, removed)
    orderMutation.mutate(list.map((item, idx) => ({ id: item.id, sort_order: idx + 1 })))
  }

  if (isLoading) {
    return (
      <AdminLayout title="项目管理">
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="项目管理">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">项目列表</h2>
        <Link to="/admin/projects/new/edit" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors">
          <Plus size={16} /> 新建项目
        </Link>
      </div>

      <div className="space-y-3">
        {sorted.map((project, index) => (
          <div
            key={project.id}
            draggable
            onDragStart={() => { setDragIndex(index); dragRef.current = { from: index, to: index } }}
            onDragOver={(e) => { e.preventDefault(); setDropIndex(index); if (dragRef.current) dragRef.current.to = index }}
            onDrop={() => {
              if (dragRef.current && dragRef.current.from !== dragRef.current.to) {
                move(dragRef.current.from, dragRef.current.to)
              }
              setDragIndex(null); setDropIndex(null); dragRef.current = null
            }}
            className={`bg-bg-secondary border border-border rounded-xl p-4 transition-colors ${
              dragIndex === index ? 'opacity-50 border-dashed border-accent' : dropIndex === index ? 'border-accent' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <GripVertical size={14} className="text-text-secondary cursor-grab" />
                <span className="text-xs text-text-secondary w-4">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="font-medium text-text-primary text-sm">{project.title}</span>
                <span className="text-xs text-text-secondary font-mono">{project.slug}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${project.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {project.status === 'published' ? '已发布' : '草稿'}
                </span>
                {project.featured && <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">精选</span>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link to={`/admin/projects/${project.id}/edit`} className="p-2 text-text-secondary hover:text-accent transition-colors" title="编辑"><Pencil size={16} /></Link>
                <button
                  onClick={() => { if (confirm(`确定删除项目「${project.title}」吗？`)) deleteProject.mutate(project.id) }}
                  disabled={deleteProject.isPending}
                  className="p-2 text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50" title="删除"
                ><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
