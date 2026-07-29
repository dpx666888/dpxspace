import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2, GripVertical } from 'lucide-react'
import AdminLayout from '../components/AdminLayout'
import IconPicker from '../components/IconPicker'
import { useAbout } from '../../hooks/useAbout'
import { updateAbout } from '../../services/about.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AboutInput, Certificate, Practice, SkillCategory, GrowthRoute } from '../../types/database'

const aboutSchema = z.object({
  school: z.string().min(1, '请输入学校'),
  major: z.string().min(1, '请输入专业'),
  period: z.string().min(1, '请输入时间段'),
  courses: z.string().min(1, '请输入主修课程'),
  achievements: z.string().min(1, '请输入学业成绩'),
  competitions: z.string().min(1, '请输入竞赛荣誉'),
})

type AboutFormData = z.infer<typeof aboutSchema>

const DEFAULT_SECTION_ORDER = ['about', 'education', 'tech', 'practices', 'certificates', 'growth']

const sectionLabels: Record<string, string> = {
  about: '关于我',
  education: '教育经历',
  tech: '技术方向',
  practices: '实践经历',
  certificates: '技能与证书',
  growth: '成长路线',
}

export default function AboutManage() {
  const { data: about, isLoading } = useAbout()
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: AboutInput) => updateAbout(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['about'] }),
  })

  const [intro, setIntro] = useState<string[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [practices, setPractices] = useState<Practice[]>([])
  const [techStacks, setTechStacks] = useState<SkillCategory[]>([])
  const [growthRoutes, setGrowthRoutes] = useState<GrowthRoute[]>([])
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTION_ORDER)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const dragRef = useRef<{ from: number; to: number } | null>(null)

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: { school: '', major: '', period: '', courses: '', achievements: '', competitions: '' },
  })

  useEffect(() => {
    if (about) {
      resetForm({
        school: about.education.school,
        major: about.education.major,
        period: about.education.period,
        courses: about.education.courses,
        achievements: about.education.achievements,
        competitions: about.education.competitions,
      })
      setIntro(about.intro)
      setCertificates(about.certificates)
      setPractices(about.practice)
      setTechStacks(about.tech_stack)
      setGrowthRoutes(about.growth_route)
      const loaded = about.section_order?.length ? about.section_order : DEFAULT_SECTION_ORDER
      setSectionOrder(loaded.filter(key => key in sectionLabels))
    }
  }, [about, resetForm])

  const onSubmit = (values: AboutFormData) => {
    const payload: AboutInput = {
      intro,
      education: {
        school: values.school,
        major: values.major,
        period: values.period,
        courses: values.courses,
        achievements: values.achievements,
        competitions: values.competitions,
      },
      certificates,
      practice: practices,
      tech_stack: techStacks,
      growth_route: growthRoutes,
      section_order: sectionOrder.filter(key => key in sectionLabels),
    }
    mutation.mutate(payload)
  }

  const moveSection = (from: number, to: number) => {
    const next = [...sectionOrder]
    const [removed] = next.splice(from, 1)
    next.splice(to, 0, removed)
    setSectionOrder(next)
  }

  const updateArrayItem = <T,>(arr: T[], i: number, patch: Partial<T>, setter: (v: T[]) => void) => {
    const next = [...arr]
    next[i] = { ...next[i], ...patch }
    setter(next)
  }
  const removeArrayItem = <T,>(arr: T[], i: number, setter: (v: T[]) => void) => {
    setter(arr.filter((_, idx) => idx !== i))
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'
  const labelClass = 'block text-sm text-text-secondary mb-1'

  if (isLoading) {
    return (
      <AdminLayout title="关于我管理">
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  const renderSection = (key: string) => {
    switch (key) {
      case 'about':
        return (
          <>
            {intro.map((paragraph, index) => (
              <div key={index} className="flex gap-2 items-start">
                <textarea
                  value={paragraph}
                  onChange={e => { const next = [...intro]; next[index] = e.target.value; setIntro(next) }}
                  rows={2}
                  className={inputClass}
                />
                <button type="button" onClick={() => removeArrayItem(intro, index, setIntro)} className="p-2 text-text-secondary hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setIntro([...intro, ''])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"><Plus size={14} /> 添加段落</button>
          </>
        )
      case 'education':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['school','major','period','courses','achievements','competitions'] as const).map(field => (
              <div key={field}>
                <label className={labelClass}>{({school:'学校',major:'专业',period:'时间段',courses:'主修课程',achievements:'学业成绩',competitions:'竞赛荣誉'})[field]}</label>
                <input {...register(field)} className={inputClass} />
                {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>
        )
      case 'tech':
        return (
          <>
            {techStacks.map((techStack, index) => (
              <div key={index} className="p-4 bg-bg-primary border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">#{index + 1}</span>
                  <button type="button" onClick={() => removeArrayItem(techStacks, index, setTechStacks)} className="text-text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>分类名称</label>
                    <input value={techStack.title} onChange={e => updateArrayItem(techStacks, index, { title: e.target.value }, setTechStacks)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>图标</label>
                    <IconPicker value={techStack.icon} onChange={icon => updateArrayItem(techStacks, index, { icon }, setTechStacks)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>技能（逗号分隔）</label>
                  <input value={techStack.skills.join(', ')} onChange={e => updateArrayItem(techStacks, index, { skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean) }, setTechStacks)} className={inputClass} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setTechStacks([...techStacks, { title: '', icon: 'Code2', skills: [] }])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"><Plus size={14} /> 添加技术方向</button>
          </>
        )
      case 'practices':
        return (
          <>
            {practices.map((practice, index) => (
              <div key={index} className="p-4 bg-bg-primary border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">#{index + 1}</span>
                  <button type="button" onClick={() => removeArrayItem(practices, index, setPractices)} className="text-text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>图标</label>
                    <IconPicker value={practice.icon} onChange={icon => updateArrayItem(practices, index, { icon }, setPractices)} />
                  </div>
                  <div>
                    <label className={labelClass}>角色</label>
                    <input value={practice.role} onChange={e => updateArrayItem(practices, index, { role: e.target.value }, setPractices)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>标题</label>
                  <input value={practice.title} onChange={e => updateArrayItem(practices, index, { title: e.target.value }, setPractices)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>描述</label>
                  <textarea value={practice.desc} onChange={e => updateArrayItem(practices, index, { desc: e.target.value }, setPractices)} rows={2} className={inputClass} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setPractices([...practices, { icon: 'Wrench', title: '', role: '', desc: '' }])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"><Plus size={14} /> 添加实践经历</button>
          </>
        )
      case 'certificates':
        return (
          <>
            {certificates.map((cert, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input value={cert.name} onChange={e => updateArrayItem(certificates, index, { name: e.target.value }, setCertificates)} className={inputClass} placeholder="证书名称" />
                <div className="w-36 shrink-0">
                  <IconPicker value={cert.icon} onChange={icon => updateArrayItem(certificates, index, { icon }, setCertificates)} />
                </div>
                <button type="button" onClick={() => removeArrayItem(certificates, index, setCertificates)} className="p-2 text-text-secondary hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => setCertificates([...certificates, { name: '', icon: 'Award' }])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"><Plus size={14} /> 添加证书</button>
          </>
        )
      case 'growth':
        return (
          <>
            {growthRoutes.map((route, index) => (
              <div key={index} className="p-4 bg-bg-primary border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">#{index + 1}</span>
                  <button type="button" onClick={() => removeArrayItem(growthRoutes, index, setGrowthRoutes)} className="text-text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>时间段</label>
                    <input value={route.period} onChange={e => updateArrayItem(growthRoutes, index, { period: e.target.value }, setGrowthRoutes)} className={inputClass} placeholder="2026.07" />
                  </div>
                  <div>
                    <label className={labelClass}>标题</label>
                    <input value={route.title} onChange={e => updateArrayItem(growthRoutes, index, { title: e.target.value }, setGrowthRoutes)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>描述</label>
                  <textarea value={route.desc} onChange={e => updateArrayItem(growthRoutes, index, { desc: e.target.value }, setGrowthRoutes)} rows={2} className={inputClass} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setGrowthRoutes([...growthRoutes, { period: '', title: '', desc: '' }])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"><Plus size={14} /> 添加成长节点</button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <AdminLayout title="关于我管理">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl" key={about?.updated_at}>

        {/* 模块排序 */}
        <section className="bg-bg-secondary border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">模块排序</h3>
          <p className="text-sm text-text-secondary mb-4">拖动调整模块顺序，前台展示将同步变化</p>
          <div className="flex flex-wrap gap-2">
            {sectionOrder.map((key, index) => (
              <div
                key={key}
                draggable
                onDragStart={() => { setDragIndex(index); dragRef.current = { from: index, to: index } }}
                onDragOver={(e) => { e.preventDefault(); setDropIndex(index); if (dragRef.current) dragRef.current.to = index }}
                onDrop={() => {
                  if (dragRef.current && dragRef.current.from !== dragRef.current.to) {
                    moveSection(dragRef.current.from, dragRef.current.to)
                  }
                  setDragIndex(null); setDropIndex(null); dragRef.current = null
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-grab active:cursor-grabbing transition-colors select-none ${
                  dragIndex === index
                    ? 'opacity-50 border-dashed border-accent bg-accent/5'
                    : dropIndex === index
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-bg-primary text-text-primary hover:border-accent/50'
                }`}
              >
                <GripVertical size={14} className="text-text-secondary shrink-0" />
                <span className="text-text-secondary text-xs">{index + 1}.</span>
                {sectionLabels[key]}
              </div>
            ))}
          </div>
        </section>

        {/* 各模块 */}
        {sectionOrder.map(key => (
          <Section key={key} title={sectionLabels[key]}>
            {renderSection(key)}
          </Section>
        ))}

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {children}
    </section>
  )
}
