import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackAbout } from '../data/fallbackData'
import type { AboutData, AboutInput } from '../types/database'

export async function getAbout(): Promise<AboutData> {
  if (!isSupabaseConfigured()) {
    console.warn('[about.service] Supabase 未配置，使用本地静态数据')
    return fallbackAbout
  }

  const { data, error } = await supabase!
    .from('about')
    .select('*')
    .single()

  if (error) {
    console.error('[about.service] 获取关于我失败:', error.message)
    throw new Error(`获取关于我失败: ${error.message}`)
  }

  return data as AboutData
}

export async function updateAbout(about: AboutInput): Promise<AboutData> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新关于我')

  const { data, error } = await supabase
    .from('about')
    .update(about as never)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    console.error('[about.service] 更新关于我失败:', error.message)
    throw new Error(`更新关于我失败: ${error.message}`)
  }

  return data as AboutData
}
