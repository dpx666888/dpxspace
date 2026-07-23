import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackAiCollabs } from '../data/fallbackData'
import type { AiCollabData, AiCollabInput } from '../types/database'

export async function getAiCollabs(): Promise<AiCollabData[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[aiCollab.service] Supabase 未配置，使用本地静态数据')
    return fallbackAiCollabs
  }

  const { data, error } = await supabase!
    .from('ai_collabs')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('[aiCollab.service] 获取协作记录失败:', error.message)
    return fallbackAiCollabs
  }

  return (data ?? fallbackAiCollabs) as AiCollabData[]
}

export async function createAiCollab(input: AiCollabInput): Promise<AiCollabData> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('ai_collabs')
    .insert(input as never)
    .select()
    .single()
  if (error) throw new Error(`创建协作记录失败: ${error.message}`)
  return data as AiCollabData
}

export async function updateAiCollab(id: number, input: Partial<AiCollabInput>): Promise<AiCollabData> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('ai_collabs')
    .update(input as never)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`更新协作记录失败: ${error.message}`)
  return data as AiCollabData
}

export async function deleteAiCollab(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.from('ai_collabs').delete().eq('id', id)
  if (error) throw new Error(`删除协作记录失败: ${error.message}`)
}

export async function updateAiCollabsOrder(items: { id: number; sort_order: number }[]): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase
    .from('ai_collabs')
    .upsert(items.map(({ id, sort_order }) => ({ id, sort_order })) as never, { onConflict: 'id' })
  if (error) throw new Error(`更新排序失败: ${error.message}`)
}
