import { api } from './api'

export type DashboardStats = {
  emotionalStatus: { positive: number; neutral: number; negative: number }
  weeklyProgress: { emotions: any[]; average: number }
  userStats: {
    activeDays: number
    completedChallenges: number
    totalMedals: number
    journalEntries: number
    exercisesCompleted: number
  }
  currentStreak: number
  longestStreak: number
}

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const statsService = {
  async getDashboard(): Promise<DashboardStats> {
    const res = await api.get('/stats/dashboard')
    return unwrap<DashboardStats>(res)
  },
  async getMonthly(params?: { year?: number; month?: number }): Promise<any> {
    const res = await api.get('/stats/monthly', { params })
    return unwrap(res)
  },
  async getEmotionsAnalysis(params?: { period?: 'week' | 'month' | 'year' }): Promise<any> {
    const res = await api.get('/stats/emotions-analysis', { params })
    return unwrap(res)
  },
}
