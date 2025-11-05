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

type ReqOpts = { skipErrorToast?: boolean }

export const exercisesService = {
  async list(params?: { type?: Exercise['type'] }, opts?: ReqOpts): Promise<{ exercises: Exercise[] }> {
    const res = await api.get('/exercises', { params, headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
  async getById(id: string, opts?: ReqOpts): Promise<Exercise & { completedCount?: number; lastCompleted?: string | null }> {
    const res = await api.get(`/exercises/${id}`, { headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
  async complete(id: string, payload: { durationMinutes?: number; rating?: number }, opts?: ReqOpts): Promise<any> {
    const res = await api.post(`/exercises/${id}/complete`, payload, { headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
  async history(params?: { limit?: number; page?: number }, opts?: ReqOpts): Promise<{ history: any[]; pagination: any }> {
    const res = await api.get('/exercises/my-history', { params, headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
}
