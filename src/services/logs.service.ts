import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackLogs } from '../data/fallbackData'
import type { Log, LogInput } from '../types/database'

export async function getLogs(): Promise<Log[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[logs.service] Supabase 未配置，使用本地静态数据')
    return fallbackLogs
  }

  const { data, error } = await supabase!
    .from('logs')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('[logs.service] 获取日志失败:', error.message)
    throw new Error(`获取日志失败: ${error.message}`)
  }

  return (data || []) as Log[]
}

export async function getLogsByCategory(category: string): Promise<Log[]> {
  if (!isSupabaseConfigured()) {
    return fallbackLogs.filter(l => l.category === category)
  }

  const { data, error } = await supabase!
    .from('logs')
    .select('*')
    .eq('category', category)
    .order('date', { ascending: false })

  if (error) {
    console.error('[logs.service] 按分类获取日志失败:', error.message)
    throw new Error(`按分类获取日志失败: ${error.message}`)
  }

  return (data || []) as Log[]
}

export async function createLog(log: LogInput): Promise<Log> {
  if (!supabase) throw new Error('Supabase 未配置，无法创建日志')

  const { data, error } = await supabase
    .from('logs')
    .insert(log as never)
    .select()
    .single()

  if (error) {
    console.error('[logs.service] 创建日志失败:', error.message)
    throw new Error(`创建日志失败: ${error.message}`)
  }

  return data as Log
}

export async function updateLog(id: number, log: Partial<LogInput>): Promise<Log> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新日志')

  const { data, error } = await supabase
    .from('logs')
    .update(log as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[logs.service] 更新日志失败:', error.message)
    throw new Error(`更新日志失败: ${error.message}`)
  }

  return data as Log
}

export async function deleteLog(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置，无法删除日志')

  const { error } = await supabase
    .from('logs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[logs.service] 删除日志失败:', error.message)
    throw new Error(`删除日志失败: ${error.message}`)
  }
}
