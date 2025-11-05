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

type ReqOpts = { skipErrorToast?: boolean }

export const challengesService = {
  async list(params?: { type?: 'weekly' | 'monthly' | 'special'; isActive?: boolean }, opts?: ReqOpts): Promise<{ challenges: Challenge[] }> {
    const res = await api.get('/challenges', { params, headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
  async start(challengeId: string, opts?: ReqOpts): Promise<UserChallenge> {
    const res = await api.post(`/challenges/${challengeId}/start`, undefined, { headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap<UserChallenge>(res)
  },
  async myChallenges(params?: { status?: 'active' | 'completed' | 'all' }, opts?: ReqOpts): Promise<{ challenges: UserChallenge[] }> {
    const res = await api.get('/challenges/my-challenges', { params, headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
  async completeDay(userChallengeId: string, date: string, opts?: ReqOpts): Promise<any> {
    const res = await api.post(`/challenges/${userChallengeId}/complete-day`, { date }, { headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
  async abandon(userChallengeId: string, opts?: ReqOpts): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/challenges/${userChallengeId}`, { headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })
    return unwrap(res)
  },
}
