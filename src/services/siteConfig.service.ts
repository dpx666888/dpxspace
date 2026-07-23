import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackHomeConfig } from '../data/fallbackData'
import type { HomePageConfig } from '../types/database'

export async function getHomeConfig(): Promise<HomePageConfig> {
  if (!isSupabaseConfigured()) {
    console.warn('[siteConfig.service] Supabase 未配置，使用本地静态数据')
    return fallbackHomeConfig
  }

  const { data, error } = await supabase!
    .from('site_config')
    .select('value')
    .eq('key', 'home')
    .single()

  if (error) {
    console.error('[siteConfig.service] 获取首页配置失败:', error.message)
    return fallbackHomeConfig
  }

  return ((data as { value: HomePageConfig } | null)?.value ?? fallbackHomeConfig) as HomePageConfig
}

export async function updateHomeConfig(config: HomePageConfig): Promise<HomePageConfig> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新首页配置')

  const { data, error } = await supabase
    .from('site_config')
    .upsert({ key: 'home', value: config } as never, { onConflict: 'key' })
    .select('value')
    .single()

  if (error) {
    console.error('[siteConfig.service] 更新首页配置失败:', error.message)
    throw new Error(`更新首页配置失败: ${error.message}`)
  }

  return ((data as { value: HomePageConfig } | null)?.value ?? config) as HomePageConfig
}
