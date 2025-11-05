import { api } from './api'

export type Tip = {
  id: string
  title: string
  description: string
  category: string
  icon?: string
  isFavorite?: boolean
}

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const tipsService = {
  async list(params?: { category?: string; limit?: number }): Promise<{ tips: Tip[] }> {
    const res = await api.get('/tips', { params })
    return unwrap(res)
  },
  async favorites(): Promise<{ favorites: Array<{ id: string; tipId: string; tip: Tip; createdAt: string }> }> {
    const res = await api.get('/tips/favorites')
    return unwrap(res)
  },
  async addFavorite(tipId: string): Promise<any> {
    const res = await api.post(`/tips/${tipId}/favorite`)
    return unwrap(res)
  },
  async removeFavorite(tipId: string): Promise<any> {
    const res = await api.delete(`/tips/${tipId}/favorite`)
    return unwrap(res)
  },
}
