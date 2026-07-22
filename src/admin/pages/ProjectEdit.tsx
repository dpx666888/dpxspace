import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { useProjects } from '../../hooks/useProjects'
import { useCreateProject, useUpdateProject } from '../hooks/useProjectMutations'
import type { ProjectStory } from '../../types/database'

const projectSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  slug: z.string().min(1, '请输入 slug'),
  description: z.string().min(1, '请输入描述'),
  tags: z.string().min(1, '请输入标签'),
  tech_stack: z.string().min(1, '请输入技术栈'),
  github_url: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  story: z.string().min(1, '请输入项目故事 JSON'),
  ai_collaboration: z.string().optional(),
})

type ProjectForm = z.infer<typeof projectSchema>

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const { data: projects, isLoading: listLoading } = useProjects()
  const project = isNew ? undefined : projects?.find(p => String(p.id) === id)

  const createProject = useCreateProject()
  const updateProject = useUpdateProject()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      tags: '',
      tech_stack: '',
      github_url: '',
      status: 'published',
      featured: false,
      story: JSON.stringify({
        why: '',
        design: '',
        development: '',
        problems: [],
        solutions: '',
        result: '',
        summary: '',
      }, null, 2),
      ai_collaboration: '',
    },
  })

  useEffect(() => {
    if (!isNew && project) {
      reset({
        title: project.title,
        slug: project.slug,
        description: project.description,
        tags: project.tags.join(', '),
        tech_stack: project.tech_stack.join(', '),
        github_url: project.github_url ?? '',
        status: project.status,
        featured: project.featured,
        story: JSON.stringify(project.story, null, 2),
        ai_collaboration: project.ai_collaboration ?? '',
      })
    }
  }, [project, isNew, reset])

  const onSubmit = (values: ProjectForm) => {
    let story: ProjectStory
    try {
      story = JSON.parse(values.story)
    } catch {
      alert('项目故事 JSON 格式错误')
      return
    }

    const payload = {
      title: values.title,
      slug: values.slug,
      description: values.description,
      tags: values.tags.split(',').map(s => s.trim()).filter(Boolean),
      tech_stack: values.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      github_url: values.github_url || null,
      live_url: null,
      cover_image: null,
      status: values.status,
      featured: values.featured,
      story,
      ai_collaboration: values.ai_collaboration || null,
    }

    if (isNew) {
      createProject.mutate(payload, {
        onSuccess: () => navigate('/admin/projects'),
      })
    } else if (project) {
      updateProject.mutate(
        { id: project.id, project: payload },
        { onSuccess: () => navigate('/admin/projects') }
      )
    }
  }

  if (listLoading || (!isNew && !project && projects)) {
    return (
      <AdminLayout title={isNew ? '新建项目' : '编辑项目'}>
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  const mutationPending = createProject.isPending || updateProject.isPending

  return (
    <AdminLayout title={isNew ? '新建项目' : '编辑项目'}>
      <div className="mb-6">
        <Link
          to="/admin/projects"
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
            <label className="block text-sm text-text-secondary mb-1.5">slug</label>
            <input
              {...register('slug')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">描述</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">标签（用逗号分隔）</label>
            <input
              {...register('tags')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm text-text-secondary mb-1.5">GitHub 链接</label>
            <input
              {...register('github_url')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">状态</label>
            <select
              {...register('status')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="featured"
            {...register('featured')}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="featured" className="text-sm text-text-secondary">设为精选项目</label>
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">项目故事（JSON）</label>
          <textarea
            {...register('story')}
            rows={12}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          {errors.story && <p className="text-xs text-red-500 mt-1">{errors.story.message}</p>}
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">AI 协作记录</label>
          <textarea
            {...register('ai_collaboration')}
            rows={3}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={mutationPending}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {mutationPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? '创建项目' : '保存修改'}
          </button>
          <Link
            to="/admin/projects"
            className="px-6 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg-primary transition-colors"
          >
            取消
          </Link>
        </div>
      </form>
    </AdminLayout>
  )
}
