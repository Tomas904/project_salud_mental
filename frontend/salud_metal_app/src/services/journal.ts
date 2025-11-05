import { api } from './api'

export type JournalEntry = {
  id: string
  userId?: string
  title: string
  content: string
  mood?: string
  date: string
  createdAt?: string
  updatedAt?: string
}

export type JournalCreate = Pick<JournalEntry, 'title' | 'content' | 'mood' | 'date'>
export type JournalUpdate = Partial<Pick<JournalEntry, 'title' | 'content' | 'mood'>>

export type JournalListParams = { limit?: number; page?: number; search?: string }
export type Pagination = { total: number; page: number; limit: number; pages: number }

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const journalService = {
  async create(payload: JournalCreate): Promise<JournalEntry> {
    const res = await api.post('/journal', payload)
    return unwrap<JournalEntry>(res)
  },
  async list(params?: JournalListParams): Promise<{ entries: JournalEntry[]; pagination: Pagination }> {
    const res = await api.get('/journal', { params })
    return unwrap(res)
  },
  async getById(id: string): Promise<JournalEntry> {
    const res = await api.get(`/journal/${id}`)
    return unwrap<JournalEntry>(res)
  },
  async update(id: string, payload: JournalUpdate): Promise<JournalEntry> {
    const res = await api.put(`/journal/${id}`, payload)
    return unwrap<JournalEntry>(res)
  },
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/journal/${id}`)
    return unwrap(res)
  },
}
