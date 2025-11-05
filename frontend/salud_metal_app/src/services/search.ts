import { api } from './api'

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const searchService = {
  async search(params: { q: string; type?: 'tips' | 'journal' | 'challenges' | 'exercises' | 'all' }): Promise<any> {
    const res = await api.get('/search', { params })
    return unwrap(res)
  },
}
