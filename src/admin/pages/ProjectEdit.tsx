import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react'
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
  story_why: z.string().min(1, '请输入项目背景'),
  story_design: z.string().min(1, '请输入设计方案'),
  story_development: z.string().min(1, '请输入开发过程'),
  story_solutions: z.string().min(1, '请输入解决方案'),
  story_result: z.string().min(1, '请输入项目成果'),
  story_summary: z.string().min(1, '请输入项目总结'),
  ai_collaboration: z.string().optional(),
})

type ProjectForm = z.infer<typeof projectSchema>

interface StoryProblem {
  title: string
  desc: string
}

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const { data: projects, isLoading: listLoading } = useProjects()
  const project = isNew ? undefined : projects?.find(p => String(p.id) === id)

  const createProject = useCreateProject()
  const updateProject = useUpdateProject()

  const [storyProblems, setStoryProblems] = useState<StoryProblem[]>([])

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
      story_why: '',
      story_design: '',
      story_development: '',
      story_solutions: '',
      story_result: '',
      story_summary: '',
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
        story_why: project.story.why ?? '',
        story_design: project.story.design ?? '',
        story_development: project.story.development ?? '',
        story_solutions: project.story.solutions ?? '',
        story_result: project.story.result ?? '',
        story_summary: project.story.summary ?? '',
        ai_collaboration: project.ai_collaboration ?? '',
      })
      setStoryProblems(project.story.problems ?? [])
    }
  }, [project, isNew, reset])

  const onSubmit = (values: ProjectForm) => {
    const story: ProjectStory = {
      why: values.story_why,
      design: values.story_design,
      development: values.story_development,
      problems: storyProblems,
      solutions: values.story_solutions,
      result: values.story_result,
      summary: values.story_summary,
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

  const inputClass = 'w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent'
  const labelClass = 'block text-sm text-text-secondary mb-1.5'

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
            <label className={labelClass}>标题</label>
            <input {...register('title')} className={inputClass} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>slug</label>
            <input {...register('slug')} className={inputClass} />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>描述</label>
          <textarea {...register('description')} rows={3} className={inputClass} />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>标签（逗号分隔）</label>
            <input {...register('tags')} className={inputClass} />
            {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
          </div>
          <div>
            <label className={labelClass}>技术栈（逗号分隔）</label>
            <input {...register('tech_stack')} className={inputClass} />
            {errors.tech_stack && <p className="text-xs text-red-500 mt-1">{errors.tech_stack.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>GitHub 链接</label>
            <input {...register('github_url')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>状态</label>
            <select {...register('status')} className={inputClass}>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 accent-accent" />
          <label htmlFor="featured" className="text-sm text-text-secondary">设为精选项目</label>
        </div>

        {/* 项目故事 */}
        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">项目故事</h3>

          <div>
            <label className={labelClass}>项目背景</label>
            <textarea {...register('story_why')} rows={2} className={inputClass} placeholder="为什么要做这个项目？" />
            {errors.story_why && <p className="text-xs text-red-500 mt-1">{errors.story_why.message}</p>}
          </div>

          <div>
            <label className={labelClass}>设计方案</label>
            <textarea {...register('story_design')} rows={2} className={inputClass} placeholder="技术选型和架构设计" />
            {errors.story_design && <p className="text-xs text-red-500 mt-1">{errors.story_design.message}</p>}
          </div>

          <div>
            <label className={labelClass}>开发过程</label>
            <textarea {...register('story_development')} rows={2} className={inputClass} placeholder="开发过程中的关键节点" />
            {errors.story_development && <p className="text-xs text-red-500 mt-1">{errors.story_development.message}</p>}
          </div>

          <div>
            <label className={labelClass}>遇到的问题</label>
            {storyProblems.map((problem, index) => (
              <div key={index} className="flex gap-2 mb-2 items-start">
                <input
                  value={problem.title}
                  onChange={e => {
                    const next = [...storyProblems]
                    next[index] = { ...next[index], title: e.target.value }
                    setStoryProblems(next)
                  }}
                  className={`${inputClass} flex-1`}
                  placeholder="问题"
                />
                <input
                  value={problem.desc}
                  onChange={e => {
                    const next = [...storyProblems]
                    next[index] = { ...next[index], desc: e.target.value }
                    setStoryProblems(next)
                  }}
                  className={`${inputClass} flex-[2]`}
                  placeholder="解决方案"
                />
                <button type="button" onClick={() => setStoryProblems(storyProblems.filter((_, i) => i !== index))} className="p-2 text-text-secondary hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setStoryProblems([...storyProblems, { title: '', desc: '' }])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light mt-1"><Plus size={14} /> 添加问题</button>
          </div>

          <div>
            <label className={labelClass}>解决方案</label>
            <textarea {...register('story_solutions')} rows={2} className={inputClass} placeholder="整体解决方案总结" />
            {errors.story_solutions && <p className="text-xs text-red-500 mt-1">{errors.story_solutions.message}</p>}
          </div>

          <div>
            <label className={labelClass}>项目成果</label>
            <textarea {...register('story_result')} rows={2} className={inputClass} placeholder="最终成果和数据" />
            {errors.story_result && <p className="text-xs text-red-500 mt-1">{errors.story_result.message}</p>}
          </div>

          <div>
            <label className={labelClass}>项目总结</label>
            <textarea {...register('story_summary')} rows={2} className={inputClass} placeholder="收获与反思" />
            {errors.story_summary && <p className="text-xs text-red-500 mt-1">{errors.story_summary.message}</p>}
          </div>
        </section>

        <div>
          <label className={labelClass}>AI 协作记录</label>
          <textarea {...register('ai_collaboration')} rows={3} className={inputClass} />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={mutationPending} className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50 inline-flex items-center gap-2">
            {mutationPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isNew ? '创建项目' : '保存修改'}
          </button>
          <Link to="/admin/projects" className="px-6 py-2.5 border border-border text-text-primary rounded-lg hover:bg-bg-primary transition-colors">取消</Link>
        </div>
      </form>
    </AdminLayout>
  )
}
