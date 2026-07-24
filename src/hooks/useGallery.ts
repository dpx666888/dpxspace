import { useQuery } from '@tanstack/react-query'
import { getGallery } from '../services/gallery.service'

export function useGallery(category?: string) {
  return useQuery({
    queryKey: ['gallery', category],
    queryFn: getGallery,
    select: (data) => {
      const sorted = [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      return category ? sorted.filter(item => item.category === category) : sorted
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
