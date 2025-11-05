import { api } from './api'

export type Challenge = {
  id: string
  title: string
  description: string
  durationDays: number
  type: 'weekly' | 'monthly' | 'special'
  isActive: boolean
}

export type UserChallenge = {
  id: string
  userId?: string
  challengeId: string
  challenge: Pick<Challenge, 'title' | 'description' | 'durationDays'>
  progress: number
  currentDay: number
  completedDays: string[]
  isCompleted: boolean
  startedAt: string
}

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const challengesService = {
  async list(params?: { type?: 'weekly' | 'monthly' | 'special'; isActive?: boolean }): Promise<{ challenges: Challenge[] }> {
    const res = await api.get('/challenges', { params })
    return unwrap(res)
  },
  async start(challengeId: string): Promise<UserChallenge> {
    const res = await api.post(`/challenges/${challengeId}/start`)
    return unwrap<UserChallenge>(res)
  },
  async myChallenges(params?: { status?: 'active' | 'completed' | 'all' }): Promise<{ challenges: UserChallenge[] }> {
    const res = await api.get('/challenges/my-challenges', { params })
    return unwrap(res)
  },
  async completeDay(userChallengeId: string, date: string): Promise<any> {
    const res = await api.post(`/challenges/${userChallengeId}/complete-day`, { date })
    return unwrap(res)
  },
  async abandon(userChallengeId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/challenges/${userChallengeId}`)
    return unwrap(res)
  },
}
