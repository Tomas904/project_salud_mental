import { api } from './api'

export type Exercise = {
  id: string
  title: string
  description: string
  type: 'meditacion' | 'respiracion' | 'estiramiento'
  durationMinutes?: number
  icon?: string
  videoUrl?: string | null
  instructions?: string[]
}

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const exercisesService = {
  async list(params?: { type?: Exercise['type'] }): Promise<{ exercises: Exercise[] }> {
    const res = await api.get('/exercises', { params })
    return unwrap(res)
  },
  async getById(id: string): Promise<Exercise & { completedCount?: number; lastCompleted?: string | null }> {
    const res = await api.get(`/exercises/${id}`)
    return unwrap(res)
  },
  async complete(id: string, payload: { durationMinutes?: number; rating?: number }): Promise<any> {
    const res = await api.post(`/exercises/${id}/complete`, payload)
    return unwrap(res)
  },
  async history(params?: { limit?: number; page?: number }): Promise<{ history: any[]; pagination: any }> {
    const res = await api.get('/exercises/my-history', { params })
    return unwrap(res)
  },
}
