import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useLabs } from '../../hooks/useLabs'
import { useCreateLab, useUpdateLab } from '../hooks/useLabMutations'

const labSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  type: z.enum(['工具', 'Demo', '实验']),
  status: z.enum(['进行中', '已完成']),
  description: z.string().min(1, '请输入描述'),
  tech_stack: z.string().min(1, '请输入技术栈'),
  demo_url: z.string().optional(),
  github_url: z.string().optional(),
})

type LabForm = z.infer<typeof labSchema>

export default function LabEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const { data: labs, isLoading: listLoading } = useLabs()
  const lab = isNew ? undefined : labs?.find(l => String(l.id) === id)

  const createLab = useCreateLab()
  const updateLab = useUpdateLab()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LabForm>({
    resolver: zodResolver(labSchema),
    defaultValues: {
      title: '',
      type: '实验',
      status: '已完成',
      description: '',
      tech_stack: '',
      demo_url: '',
      github_url: '',
    },
  })

  useEffect(() => {
    if (!isNew && lab) {
      reset({
        title: lab.title,
        type: lab.type,
        status: lab.status,
        description: lab.description,
        tech_stack: lab.tech_stack.join(', '),
        demo_url: lab.demo_url ?? '',
        github_url: lab.github_url ?? '',
      })
    }
  }, [lab, isNew, reset])

  const onSubmit = (values: LabForm) => {
    const payload = {
      title: values.title,
      type: values.type,
      status: values.status,
      description: values.description,
      tech_stack: values.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      demo_url: values.demo_url || null,
      github_url: values.github_url || null,
      cover_image: null,
    }

    if (isNew) {
      createLab.mutate(payload, { onSuccess: () => navigate('/admin/labs') })
    } else if (lab) {
      updateLab.mutate(
        { id: lab.id, lab: payload },
        { onSuccess: () => navigate('/admin/labs') }
      )
    }
  }

  if (listLoading) {
    return (
      <AdminLayout title={isNew ? '新建实验' : '编辑实验'}>
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  if (!isNew && !lab) {
    return (
      <AdminLayout title="编辑实验">
        <div className="p-12 text-center">
          <p className="text-text-secondary mb-4">未找到该实验记录</p>
          <Link to="/admin/labs" className="text-accent hover:text-accent-light text-sm">返回列表</Link>
        </div>
      </AdminLayout>
    )
  }

  const mutationPending = createLab.isPending || updateLab.isPending

  return (
    <AdminLayout title={isNew ? '新建实验' : '编辑实验'}>
      <div className="mb-6">
        <Link
          to="/admin/labs"
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
            <label className="block text-sm text-text-secondary mb-1.5">类型</label>
            <select
              {...register('type')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="工具">工具</option>
              <option value="Demo">Demo</option>
              <option value="实验">实验</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">状态</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">技术栈（用逗号分隔）</label>
            <input
              {...register('tech_stack')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.tech_stack && <p className="text-xs text-red-500 mt-1">{errors.tech_stack.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">描述</label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Demo 链接</label>
            <input
              {...register('demo_url')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">源码链接</label>
            <input
              {...register('github_url')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={mutationPending}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {mutationPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? '创建实验' : '保存修改'}
          </button>
          <Link
            to="/admin/labs"
            className="px-6 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg-primary transition-colors"
          >
            取消
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}
