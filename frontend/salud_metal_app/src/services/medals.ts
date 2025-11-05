import { api } from './api'

export type Medal = {
  id?: string
  medalType: string
  name?: string
  description?: string
  icon?: string
  isUnlocked?: boolean
  earnedAt?: string | null
  challenge?: { id: string; title: string } | null
}

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const medalsService = {
  async myMedals(): Promise<{ medals: Medal[]; summary: any }> {
    const res = await api.get('/medals/my-medals')
    return unwrap(res)
  },
  async available(): Promise<{ medals: Medal[] }> {
    const res = await api.get('/medals/available')
    return unwrap(res)
  },
}
