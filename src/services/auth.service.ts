import { logger } from '../utils/logger'
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthResult {
  user: User | null
  session: Session | null
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!supabase) throw new Error('Supabase 未配置，无法登录')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logger.error('[auth.service] 登录失败:', error.message)
    throw new Error(`登录失败: ${error.message}`)
  }

  return data
}

export async function signOut(): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.auth.signOut()
  if (error) {
    logger.error('[auth.service] 退出失败:', error.message)
    throw new Error(`退出失败: ${error.message}`)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data, error } = await supabase.auth.getSession()
  if (error) return null
  return data.session
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!supabase) {
    return { subscription: { unsubscribe: () => {} } }
  }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
  return data
}
