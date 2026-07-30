import { logger } from '../utils/logger'
import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackHomeConfig } from '../data/fallbackData'
import type { HomePageConfig } from '../types/database'

export async function getHomeConfig(): Promise<HomePageConfig> {
  if (!isSupabaseConfigured()) {
    logger.warn('[siteConfig.service] Supabase 未配置，使用本地静态数据')
    return fallbackHomeConfig
  }

  const { data, error } = await supabase!
    .from('site_config')
    .select('value')
    .eq('key', 'home')
    .single()

  if (error) {
    logger.error('[siteConfig.service] 获取首页配置失败:', error.message)
    return fallbackHomeConfig
  }

  const dbValue = (data as { value: Partial<HomePageConfig> } | null)?.value
  return { ...fallbackHomeConfig, ...(dbValue ?? {}) } as HomePageConfig
}

export async function updateHomeConfig(config: HomePageConfig): Promise<HomePageConfig> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新首页配置')

  const { data, error } = await supabase
    .from('site_config')
    .upsert({ key: 'home', value: config } as never, { onConflict: 'key' })
    .select('value')
    .single()

  if (error) {
    logger.error('[siteConfig.service] 更新首页配置失败:', error.message)
    throw new Error(`更新首页配置失败: ${error.message}`)
  }

  const dbValue = (data as { value: Partial<HomePageConfig> } | null)?.value
  return { ...config, ...(dbValue ?? {}) } as HomePageConfig
}
