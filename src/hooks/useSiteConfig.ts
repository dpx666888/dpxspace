import { useQuery } from '@tanstack/react-query'
import { getHomeConfig } from '../services/siteConfig.service'

export function useHomeConfig() {
  return useQuery({
    queryKey: ['siteConfig', 'home'],
    queryFn: getHomeConfig,
  })
}
