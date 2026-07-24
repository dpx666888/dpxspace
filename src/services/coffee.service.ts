import { supabase, isSupabaseConfigured } from './supabase'
import type { CoffeeLogData, CoffeeLogInput } from '../types/database'

export async function getCoffeeLogs(): Promise<CoffeeLogData[]> {
  if (!isSupabaseConfigured()) return []

  const { data, error } = await supabase!
    .from('coffee_logs')
    .select('*')
    .order('sort_order')

  if (error) return []
  return (data || []) as CoffeeLogData[]
}

export async function createCoffeeLog(input: CoffeeLogInput): Promise<CoffeeLogData> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('coffee_logs')
    .insert(input as never)
    .select()
    .single()
  if (error) throw new Error(`创建失败: ${error.message}`)
  return data as CoffeeLogData
}

export async function updateCoffeeLog(id: number, input: Partial<CoffeeLogInput>): Promise<CoffeeLogData> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('coffee_logs')
    .update(input as never)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`更新失败: ${error.message}`)
  return data as CoffeeLogData
}

export async function deleteCoffeeLog(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.from('coffee_logs').delete().eq('id', id)
  if (error) throw new Error(`删除失败: ${error.message}`)
}

export async function reorderCoffeeLogs(items: { id: number; sort_order: number }[]): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase
    .from('coffee_logs')
    .upsert(items as never, { onConflict: 'id' })
  if (error) throw new Error(`排序失败: ${error.message}`)
}
