import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackLabs } from '../data/fallbackData'
import type { Lab, LabInput } from '../types/database'

export async function getLabs(): Promise<Lab[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[labs.service] Supabase 未配置，使用本地静态数据')
    return fallbackLabs
  }

  const { data, error } = await supabase!
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[labs.service] 获取实验室项目失败:', error.message)
    throw new Error(`获取实验室项目失败: ${error.message}`)
  }

  return (data || []) as Lab[]
}

export async function createLab(lab: LabInput): Promise<Lab> {
  if (!supabase) throw new Error('Supabase 未配置，无法创建实验室项目')

  const { data, error } = await supabase
    .from('labs')
    .insert(lab as never)
    .select()
    .single()

  if (error) {
    console.error('[labs.service] 创建实验室项目失败:', error.message)
    throw new Error(`创建实验室项目失败: ${error.message}`)
  }

  return data as Lab
}

export async function updateLab(id: number, lab: Partial<LabInput>): Promise<Lab> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新实验室项目')

  const { data, error } = await supabase
    .from('labs')
    .update(lab as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[labs.service] 更新实验室项目失败:', error.message)
    throw new Error(`更新实验室项目失败: ${error.message}`)
  }

  return data as Lab
}

export async function deleteLab(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置，无法删除实验室项目')

  const { error } = await supabase
    .from('labs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[labs.service] 删除实验室项目失败:', error.message)
    throw new Error(`删除实验室项目失败: ${error.message}`)
  }
}
