import { logger } from '../utils/logger'
import { supabase, isSupabaseConfigured } from './supabase'
import type { GalleryItem, GalleryInput } from '../types/database'

const BUCKET = 'gallery'

export async function getGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return []

  const { data, error } = await supabase!
    .from('gallery')
    .select('*')
    .order('sort_order')

  if (error) return []
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

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadImage(file: File, subFolder: string = 'archive'): Promise<{ url: string; path: string }> {
  if (!supabase) throw new Error('Supabase 未配置，无法上传图片')

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`不支持的图片格式：${file.type || '未知'}，仅支持 JPG/PNG/WebP/GIF`)
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`图片过大（${(file.size / 1024 / 1024).toFixed(1)}MB），请压缩至 5MB 以内`)
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filename = `${subFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${cleanName}`
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: false })
  if (error) throw new Error(`上传失败: ${error.message}`)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return { url: data.publicUrl, path: filename }
}

export async function deleteImage(storagePath: string): Promise<void> {
  if (!supabase) throw new Error('Supabase 未配置')
  if (!storagePath) return
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath])
  if (error) {
    logger.error('[gallery.service] 删除Storage图片失败:', error.message)
    throw new Error(`删除图片失败: ${error.message}`)
  }
}
