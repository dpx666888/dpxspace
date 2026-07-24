import { supabase, isSupabaseConfigured } from './supabase'
import type { GalleryItem, GalleryInput } from '../types/database'

const BUCKET = 'gallery'

export async function getGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[gallery.service] Supabase 未配置')
    return []
  }

  const { data, error } = await supabase!
    .from('gallery')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('[gallery.service] 获取图片失败:', error.message)
    return []
  }

  return (data || []) as GalleryItem[]
}

export async function createGalleryItem(input: GalleryInput): Promise<GalleryItem> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('gallery')
    .insert(input as never)
    .select()
    .single()
  if (error) throw new Error(`创建图片记录失败: ${error.message}`)
  return data as GalleryItem
}

export async function updateGalleryItem(id: number, input: Partial<GalleryInput>): Promise<GalleryItem> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { data, error } = await supabase
    .from('gallery')
    .update(input as never)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`更新图片记录失败: ${error.message}`)
  return data as GalleryItem
}

export async function deleteGalleryItem(id: number): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw new Error(`删除图片记录失败: ${error.message}`)
}

export async function reorderGallery(items: { id: number; sort_order: number }[]): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const { error } = await supabase
    .from('gallery')
    .upsert(items as never, { onConflict: 'id' })
  if (error) throw new Error(`更新排序失败: ${error.message}`)
}

export async function uploadImage(file: File): Promise<string> {
  if (!supabase) throw new Error('Supabase 未配置')
  const filename = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file)
  if (error) throw new Error(`上传图片失败: ${error.message}`)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  const { error } = await supabase.storage.from(BUCKET).remove([filename])
  if (error) throw new Error(`删除图片失败: ${error.message}`)
}
