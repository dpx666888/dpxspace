import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null

export function isSupabaseConfigured(): boolean {
  return !!supabase
}

export function getSupabaseConfigWarning(): string | null {
  if (supabase) return null
  if (!supabaseUrl && !supabaseAnonKey) {
    return 'Supabase 未配置：请在 .env.local 中设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  }
  if (!supabaseUrl) return 'Supabase URL 未配置'
  if (!supabaseAnonKey) return 'Supabase Anon Key 未配置'
  return null
}
