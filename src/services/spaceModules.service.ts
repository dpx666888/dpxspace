import { supabase, isSupabaseConfigured } from './supabase'
import type { SpaceModule, SpaceModuleInput } from '../types/database'

const FALLBACK: SpaceModule[] = [
  { id: 1, title: 'Coffee Lab', description: '我的咖啡探索与制作记录', icon: 'Coffee', route: '/space/coffee', active: true, sort_order: 1, created_at: '' },
  { id: 2, title: '视觉档案', description: '开发过程中的视觉片段和灵感', icon: 'Image', route: '/gallery', active: true, sort_order: 2, created_at: '' },
  { id: 3, title: '阅读记录', description: '正在阅读和已读的书', icon: 'BookOpen', route: '', active: false, sort_order: 3, created_at: '' },
  { id: 4, title: '我的设备', description: '开发工具和硬件设备', icon: 'Cpu', route: '', active: false, sort_order: 4, created_at: '' },
]

export async function getSpaceModules(): Promise<SpaceModule[]> {
  if (!isSupabaseConfigured()) return FALLBACK

  const { data, error } = await supabase!
    .from('space_modules')
    .select('*')
    .order('sort_order')

  if (error) return FALLBACK
  return (data || []) as SpaceModule[]
}

export async function updateSpaceModule(id: number, input: Partial<SpaceModuleInput>): Promise<SpaceModule> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('space_modules')
    .update(input as never)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`更新失败: ${error.message}`)
  return data as SpaceModule
}

export async function reorderSpaceModules(items: { id: number; sort_order: number }[]): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase
    .from('space_modules')
    .upsert(items as never, { onConflict: 'id' })
  if (error) throw new Error(`排序失败: ${error.message}`)
}
