import { api } from './api'

export type EmotionType = 'feliz' | 'tranquilo' | 'neutral' | 'triste' | 'molesto' | 'ansioso'

export type Emotion = {
  id: string
  userId?: string
  emotionType: EmotionType
  intensity: number
  note?: string | null
  date: string // YYYY-MM-DD
  createdAt?: string
  updatedAt?: string
}

export type EmotionCreate = {
  emotionType: EmotionType
  intensity: number // 1-10
  note?: string
  date: string // YYYY-MM-DD
}

export type EmotionUpdate = Partial<Pick<Emotion, 'emotionType' | 'intensity' | 'note'>>

export type EmotionsListParams = { startDate?: string; endDate?: string; limit?: number; page?: number }

export type Pagination = { total: number; page: number; limit: number; pages: number }

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const emotionsService = {
  async create(payload: EmotionCreate): Promise<Emotion> {
    const res = await api.post('/emotions', payload)
    return unwrap<Emotion>(res)
  },
  async list(params?: EmotionsListParams): Promise<{ emotions: Emotion[]; pagination: Pagination }> {
    const res = await api.get('/emotions', { params })
    return unwrap(res)
  },
  async getWeekly(): Promise<{ emotions: any[]; summary: any }> {
    const res = await api.get('/emotions/weekly')
    return unwrap(res)
  },
  async getById(id: string): Promise<Emotion> {
    const res = await api.get(`/emotions/${id}`)
    return unwrap<Emotion>(res)
  },
  async update(id: string, payload: EmotionUpdate): Promise<Emotion> {
    const res = await api.put(`/emotions/${id}`, payload)
    return unwrap<Emotion>(res)
  },
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/emotions/${id}`)
    return unwrap(res)
  },
}
