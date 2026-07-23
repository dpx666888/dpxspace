import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import IconPicker from '../components/IconPicker'
import { useContact } from '../../hooks/useContact'
import { updateContacts } from '../../services/contact.service'
import type { ContactInput, SocialLink } from '../../types/database'

const contactSchema = z.object({
  email: z.string().min(1, '请输入邮箱'),
  github: z.string().min(1, '请输入 GitHub'),
  location: z.string().min(1, '请输入位置'),
  bio: z.string().min(1, '请输入简介'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactManage() {
  const { data: contact, isLoading } = useContact()
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: ContactInput) => updateContacts(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact'] }),
  })

  const [socials, setSocials] = useState<SocialLink[]>([])

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: '', github: '', location: '', bio: '' },
  })

  useEffect(() => {
    if (contact) {
      resetForm({
        email: contact.email,
        github: contact.github,
        location: contact.location,
        bio: contact.bio,
      })
      setSocials(contact.socials)
    }
  }, [contact, resetForm])

  const onSubmit = (values: ContactFormData) => {
    const payload: ContactInput = {
      email: values.email,
      github: values.github,
      location: values.location,
      bio: values.bio,
      socials,
    }
    mutation.mutate(payload)
  }

  const inputClass = 'w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent'
  const labelClass = 'block text-sm text-text-secondary mb-1'

  if (isLoading) {
    return (
      <AdminLayout title="联系方式管理">
        <div className="p-12 flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="联系方式管理">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>邮箱</label>
              <input {...register('email')} className={inputClass} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClass}>GitHub</label>
              <input {...register('github')} className={inputClass} />
              {errors.github && <p className="text-xs text-red-500 mt-1">{errors.github.message}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>位置</label>
            <input {...register('location')} className={inputClass} />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className={labelClass}>简介</label>
            <textarea {...register('bio')} rows={3} className={inputClass} />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">社交链接</h3>
          {socials.map((social, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                value={social.platform}
                onChange={e => { const next = [...socials]; next[index] = { ...next[index], platform: e.target.value }; setSocials(next) }}
                className={inputClass}
                placeholder="平台名称"
              />
              <input
                value={social.url}
                onChange={e => { const next = [...socials]; next[index] = { ...next[index], url: e.target.value }; setSocials(next) }}
                className={inputClass}
                placeholder="链接 URL"
              />
              <div className="w-32 shrink-0">
                <IconPicker value={social.icon} onChange={icon => { const next = [...socials]; next[index] = { ...next[index], icon }; setSocials(next) }} />
              </div>
              <button type="button" onClick={() => setSocials(socials.filter((_, i) => i !== index))} className="p-2 text-text-secondary hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setSocials([...socials, { platform: '', url: '', icon: 'Github' }])} className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light"><Plus size={14} /> 添加社交链接</button>
        </div>

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
