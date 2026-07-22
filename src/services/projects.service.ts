import { supabase, isSupabaseConfigured } from './supabase'
import { fallbackProjects } from '../data/fallbackData'
import type { Project, ProjectInput, TimelineEvent } from '../types/database'

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[projects.service] Supabase 未配置，使用本地静态数据')
    return fallbackProjects
  }

  const { data, error } = await supabase!
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[projects.service] 获取项目失败:', error.message)
    throw new Error(`获取项目失败: ${error.message}`)
  }

  return (data || []) as Project[]
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return fallbackProjects.find(p => p.slug === slug) || null
  }

  const { data, error } = await supabase!
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('[projects.service] 获取项目详情失败:', error.message)
    throw new Error(`获取项目详情失败: ${error.message}`)
  }

  return data as Project
}

export async function getProjectTimeline(_projectId: number): Promise<TimelineEvent[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase!
    .from('project_timeline')
    .select('*')
    .eq('project_id', _projectId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[projects.service] 获取项目时间线失败:', error.message)
    throw new Error(`获取项目时间线失败: ${error.message}`)
  }

  return (data || []) as TimelineEvent[]
}

export async function createProject(project: ProjectInput): Promise<Project> {
  if (!supabase) throw new Error('Supabase 未配置，无法创建项目')

  const { data, error } = await supabase
    .from('projects')
    .insert(project as never)
    .select()
    .single()

  if (error) {
    console.error('[projects.service] 创建项目失败:', error.message)
    throw new Error(`创建项目失败: ${error.message}`)
  }

  return data as Project
}

export async function updateProject(id: number, project: Partial<ProjectInput>): Promise<Project> {
  if (!supabase) throw new Error('Supabase 未配置，无法更新项目')

  const { data, error } = await supabase
    .from('projects')
    .update(project as never)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[projects.service] 更新项目失败:', error.message)
    throw new Error(`更新项目失败: ${error.message}`)
  }

  return data as Project
}

export async function deleteProject(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置，无法删除项目')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[projects.service] 删除项目失败:', error.message)
    throw new Error(`删除项目失败: ${error.message}`)
  }
}
