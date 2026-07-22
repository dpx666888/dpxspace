import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useLogs } from '../../hooks/useLogs'
import { useCreateLog, useUpdateLog } from '../hooks/useLogMutations'

const logSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  date: z.string().min(1, '请输入日期'),
  category: z.enum(['学习', '项目复盘', '技术笔记']),
  content: z.string().min(1, '请输入内容'),
  tags: z.string().min(1, '请输入标签'),
})

type LogForm = z.infer<typeof logSchema>

export default function LogEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const { data: logs, isLoading: listLoading } = useLogs()
  const log = isNew ? undefined : logs?.find(l => String(l.id) === id)

  const createLog = useCreateLog()
  const updateLog = useUpdateLog()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogForm>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      title: '',
      date: '',
      category: '学习',
      content: '',
      tags: '',
    },
  })

  useEffect(() => {
    if (!isNew && log) {
      reset({
        title: log.title,
        date: log.date,
        category: log.category,
        content: log.content,
        tags: log.tags.join(', '),
      })
    }
  }, [log, isNew, reset])

  const onSubmit = (values: LogForm) => {
    const payload = {
      title: values.title,
      date: values.date,
      category: values.category,
      content: values.content,
      tags: values.tags.split(',').map(s => s.trim()).filter(Boolean),
    }

    if (isNew) {
      createLog.mutate(payload, { onSuccess: () => navigate('/admin/logs') })
    } else if (log) {
      updateLog.mutate(
        { id: log.id, log: payload },
        { onSuccess: () => navigate('/admin/logs') }
      )
    }
  }

  if (listLoading || (!isNew && !log && logs)) {
    return (
      <AdminLayout title={isNew ? '新建日志' : '编辑日志'}>
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const mutationPending = createLog.isPending || updateLog.isPending

  return (
    <AdminLayout title={isNew ? '新建日志' : '编辑日志'}>
      <div className="mb-6">
        <Link
          to="/admin/logs"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} /> 返回列表
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">标题</label>
            <input
              {...register('title')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">日期</label>
            <input
              {...register('date')}
              placeholder="2026-07-22"
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">分类</label>
            <select
              {...register('category')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="学习">学习</option>
              <option value="项目复盘">项目复盘</option>
              <option value="技术笔记">技术笔记</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">标签（用逗号分隔）</label>
            <input
              {...register('tags')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">内容</label>
          <textarea
            {...register('content')}
            rows={10}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={mutationPending}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {mutationPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? '创建日志' : '保存修改'}
          </button>
          <Link
            to="/admin/logs"
            className="px-6 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg-primary transition-colors"
          >
            取消
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}
