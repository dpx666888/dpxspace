import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import { useAbout } from '../../hooks/useAbout'
import { updateAbout } from '../../services/about.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AboutInput } from '../../types/database'

const aboutSchema = z.object({
  intro: z.string().min(1, '请输入个人简介 JSON'),
  school: z.string().min(1, '请输入学校'),
  major: z.string().min(1, '请输入专业'),
  period: z.string().min(1, '请输入时间段'),
  courses: z.string().min(1, '请输入主修课程'),
  achievements: z.string().min(1, '请输入学业成绩'),
  competitions: z.string().min(1, '请输入竞赛荣誉'),
  certificates: z.string().min(1, '请输入证书 JSON'),
  practice: z.string().min(1, '请输入实践经历 JSON'),
  tech_stack: z.string().min(1, '请输入技术方向 JSON'),
  growth_route: z.string().min(1, '请输入成长路线 JSON'),
  ai_collaboration: z.string().min(1, '请输入 AI 协作 JSON'),
})

type AboutForm = z.infer<typeof aboutSchema>

export default function AboutManage() {
  const { data: about, isLoading } = useAbout()
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: AboutInput) => updateAbout(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['about'] }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      intro: '[]',
      school: '',
      major: '',
      period: '',
      courses: '',
      achievements: '',
      competitions: '',
      certificates: '[]',
      practice: '[]',
      tech_stack: '[]',
      growth_route: '[]',
      ai_collaboration: '{}',
    },
  })

  useEffect(() => {
    if (about) {
      reset({
        intro: JSON.stringify(about.intro, null, 2),
        school: about.education.school,
        major: about.education.major,
        period: about.education.period,
        courses: about.education.courses,
        achievements: about.education.achievements,
        competitions: about.education.competitions,
        certificates: JSON.stringify(about.certificates, null, 2),
        practice: JSON.stringify(about.practice, null, 2),
        tech_stack: JSON.stringify(about.tech_stack, null, 2),
        growth_route: JSON.stringify(about.growth_route, null, 2),
        ai_collaboration: JSON.stringify(about.ai_collaboration, null, 2),
      })
    }
  }, [about, reset])

  const onSubmit = (values: AboutForm) => {
    try {
      const payload: AboutInput = {
        intro: JSON.parse(values.intro),
        education: {
          school: values.school,
          major: values.major,
          period: values.period,
          courses: values.courses,
          achievements: values.achievements,
          competitions: values.competitions,
        },
        certificates: JSON.parse(values.certificates),
        practice: JSON.parse(values.practice),
        tech_stack: JSON.parse(values.tech_stack),
        growth_route: JSON.parse(values.growth_route),
        ai_collaboration: JSON.parse(values.ai_collaboration),
      }
      mutation.mutate(payload)
    } catch {
      alert('JSON 格式错误，请检查 JSON 文本框')
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="关于我管理">
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="关于我管理">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">个人简介</h3>
          <div>
            <label className="block text-sm text-text-secondary mb-1.5">简介（JSON 字符串数组）</label>
            <textarea
              {...register('intro')}
              rows={5}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
            />
            {errors.intro && <p className="text-xs text-red-500 mt-1">{errors.intro.message}</p>}
          </div>
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">教育经历</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'school', label: '学校' },
              { key: 'major', label: '专业' },
              { key: 'period', label: '时间段' },
              { key: 'courses', label: '主修课程' },
              { key: 'achievements', label: '学业成绩' },
              { key: 'competitions', label: '竞赛荣誉' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm text-text-secondary mb-1.5">{label}</label>
                <input
                  {...register(key as keyof AboutForm)}
                  className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                />
                {errors[key as keyof AboutForm] && (
                  <p className="text-xs text-red-500 mt-1">{errors[key as keyof AboutForm]?.message}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">技术方向</h3>
          <textarea
            {...register('tech_stack')}
            rows={8}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          {errors.tech_stack && <p className="text-xs text-red-500 mt-1">{errors.tech_stack.message}</p>}
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">实践经历</h3>
          <textarea
            {...register('practice')}
            rows={8}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          {errors.practice && <p className="text-xs text-red-500 mt-1">{errors.practice.message}</p>}
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">技能与证书</h3>
          <textarea
            {...register('certificates')}
            rows={6}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          {errors.certificates && <p className="text-xs text-red-500 mt-1">{errors.certificates.message}</p>}
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">成长路线</h3>
          <textarea
            {...register('growth_route')}
            rows={8}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          {errors.growth_route && <p className="text-xs text-red-500 mt-1">{errors.growth_route.message}</p>}
        </section>

        <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-text-primary">AI 协作</h3>
          <textarea
            {...register('ai_collaboration')}
            rows={5}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
          />
          {errors.ai_collaboration && <p className="text-xs text-red-500 mt-1">{errors.ai_collaboration.message}</p>}
        </section>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            保存修改
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
