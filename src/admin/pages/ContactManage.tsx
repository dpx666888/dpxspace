import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../components/AdminLayout'
import { useContact } from '../../hooks/useContact'
import { updateContacts } from '../../services/contact.service'
import type { ContactInput } from '../../types/database'

const contactSchema = z.object({
  email: z.string().min(1, '请输入邮箱'),
  github: z.string().min(1, '请输入 GitHub'),
  location: z.string().min(1, '请输入位置'),
  bio: z.string().min(1, '请输入简介'),
  socials: z.string().min(1, '请输入社交链接 JSON'),
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactManage() {
  const { data: contact, isLoading } = useContact()
  const qc = useQueryClient()
  const mutation = useMutation({
    mutationFn: (data: ContactInput) => updateContacts(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact'] }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: '',
      github: '',
      location: '',
      bio: '',
      socials: '[]',
    },
  })

  useEffect(() => {
    if (contact) {
      reset({
        email: contact.email,
        github: contact.github,
        location: contact.location,
        bio: contact.bio,
        socials: JSON.stringify(contact.socials, null, 2),
      })
    }
  }, [contact, reset])

  const onSubmit = (values: ContactForm) => {
    try {
      const payload: ContactInput = {
        email: values.email,
        github: values.github,
        location: values.location,
        bio: values.bio,
        socials: JSON.parse(values.socials),
      }
      mutation.mutate(payload)
    } catch {
      alert('社交链接 JSON 格式错误')
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="联系方式管理">
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="联系方式管理">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="bg-bg-secondary border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">邮箱</label>
              <input
                {...register('email')}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">GitHub</label>
              <input
                {...register('github')}
                className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
              />
              {errors.github && <p className="text-xs text-red-500 mt-1">{errors.github.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">位置</label>
            <input
              {...register('location')}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">简介</label>
            <textarea
              {...register('bio')}
              rows={3}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
            />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">社交链接（JSON 数组）</label>
            <textarea
              {...register('socials')}
              rows={6}
              className="w-full px-4 py-2.5 bg-bg-primary border border-border rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-accent"
            />
            {errors.socials && <p className="text-xs text-red-500 mt-1">{errors.socials.message}</p>}
          </div>
        </div>

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
