import { logger } from '../utils/logger'
import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackContact } from '../data/fallbackData'
import type { ContactData, ContactInput } from '../types/database'

export async function getContacts(): Promise<ContactData> {
  if (!isSupabaseConfigured()) {
    logger.warn('[contact.service] Supabase 未配置，使用本地静态数据')
    return fallbackContact
  }

  const { data, error } = await supabase!
    .from('contacts')
    .select('*')
    .single()

  if (error) {
    logger.error('[contact.service] 获取联系方式失败:', error.message)
    throw new Error(`获取联系方式失败: ${error.message}`)
  }

  return data as ContactData
}

export async function updateContacts(contact: ContactInput): Promise<ContactData> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新联系方式')

  const { data, error } = await supabase
    .from('contacts')
    .update(contact as never)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    logger.error('[contact.service] 更新联系方式失败:', error.message)
    throw new Error(`更新联系方式失败: ${error.message}`)
  }

  return data as ContactData
}
