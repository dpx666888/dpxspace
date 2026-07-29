import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useHomeConfig } from '../../hooks/useSiteConfig'
import { updateHomeConfig } from '../../services/siteConfig.service'
import type { HomePageConfig } from '../../types/database'

const homeConfigSchema = z.object({
  greeting: z.string().min(1, '请输入问候语'),
  name: z.string().min(1, '请输入名称'),
  bio: z.string().min(1, '请输入简介'),
  button_text: z.string().min(1, '请输入按钮文字'),
  skills_title: z.string().min(1, '请输入技能标题'),
  projects_title: z.string().min(1, '请输入项目标题'),
  logs_title: z.string().min(1, '请输入日志标题'),
  avatar_url: z.string().optional(),
})

type HomeConfigFormData = z.infer<typeof homeConfigSchema>

export default function SiteConfigManage() {
  const { data: config, isLoading } = useHomeConfig()
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: HomePageConfig) => updateHomeConfig(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['siteConfig', 'home'] }),
  })

  const [skillsText, setSkillsText] = useState('')

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<HomeConfigFormData>({
    resolver: zodResolver(homeConfigSchema),
    defaultValues: { greeting: '', name: '', bio: '', button_text: '', skills_title: '', projects_title: '', logs_title: '', avatar_url: '' },
  })

  useEffect(() => {
    if (config) {
      resetForm({
        greeting: config.greeting,
        name: config.name,
        bio: config.bio,
        button_text: config.button_text,
        skills_title: config.skills_title,
        projects_title: config.projects_title,
        logs_title: config.logs_title,
        avatar_url: config.avatar_url ?? '',
      })
      setSkillsText(config.skills?.join(', ') ?? '')
    }
  }, [config, resetForm])

  const onSubmit = (values: HomeConfigFormData) => {
    const skills = skillsText
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)

    const payload: HomePageConfig = {
      greeting: values.greeting,
      name: values.name,
      bio: values.bio,
      button_text: values.button_text,
      skills,
      skills_title: values.skills_title,
      projects_title: values.projects_title,
      logs_title: values.logs_title,
      avatar_url: values.avatar_url ?? '',
    }
    mutation.mutate(payload)
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'
  const labelClass = 'block text-sm text-text-secondary mb-1'

  if (isLoading) {
    return (
      <AdminLayout title="首页内容管理">
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="首页内容管理">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Hero 区域</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>问候语</label>
              <input {...register('greeting')} className={inputClass} />
              {errors.greeting && <p className="text-xs text-red-500 mt-1">{errors.greeting.message}</p>}
            </div>
            <div>
              <label className={labelClass}>姓名</label>
              <input {...register('name')} className={inputClass} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>头像URL</label>
            <input {...register('avatar_url')} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>简介</label>
            <textarea {...register('bio')} rows={2} className={inputClass} />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
          </div>
          <div>
            <label className={labelClass}>按钮文字</label>
            <input {...register('button_text')} className={`${inputClass} max-w-xs`} />
            {errors.button_text && <p className="text-xs text-red-500 mt-1">{errors.button_text.message}</p>}
          </div>
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">技能区域</h3>
          <div>
            <label className={labelClass}>区域标题</label>
            <input {...register('skills_title')} className={`${inputClass} max-w-xs`} />
            {errors.skills_title && <p className="text-xs text-red-500 mt-1">{errors.skills_title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>技能标签（逗号分隔）</label>
            <input
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              className={inputClass}
              placeholder="C++, Vue, React, ..."
            />
          </div>
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">区块标题</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>项目区块标题</label>
              <input {...register('projects_title')} className={inputClass} />
              {errors.projects_title && <p className="text-xs text-red-500 mt-1">{errors.projects_title.message}</p>}
            </div>
            <div>
              <label className={labelClass}>日志区块标题</label>
              <input {...register('logs_title')} className={inputClass} />
              {errors.logs_title && <p className="text-xs text-red-500 mt-1">{errors.logs_title.message}</p>}
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 pt-4">
          <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50 inline-flex items-center gap-2">
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            保存修改
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
