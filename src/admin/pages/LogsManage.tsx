import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useLogs } from '../../hooks/useLogs'
import { useDeleteLog } from '../hooks/useLogMutations'

export default function LogsManage() {
  const { data: logs, isLoading } = useLogs()
  const deleteLog = useDeleteLog()

  return (
    <AdminLayout title="成长日志管理">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">日志列表</h2>
        <Link
          to="/admin/logs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
        >
          <Plus size={16} /> 新建日志
        </Link>
      </div>

      {isLoading ? (
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-primary border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-text-primary">标题</th>
                <th className="px-4 py-3 font-medium text-text-primary">日期</th>
                <th className="px-4 py-3 font-medium text-text-primary">分类</th>
                <th className="px-4 py-3 font-medium text-text-primary text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs?.map(log => (
                <tr key={log.id} className="hover:bg-bg-primary/50">
                  <td className="px-4 py-3 text-text-primary">{log.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{log.date}</td>
                  <td className="px-4 py-3 text-text-secondary">{log.category}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        to={`/admin/logs/${log.id}/edit`}
                        className="p-2 text-text-secondary hover:text-accent transition-colors"
                        title="编辑"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`确定删除日志「${log.title}」吗？`)) {
                            deleteLog.mutate(log.id)
                          }
                        }}
                        disabled={deleteLog.isPending}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
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
