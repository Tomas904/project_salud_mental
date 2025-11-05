import { api } from './api'

export type UserProfile = {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  timezone?: string | null
  language?: string | null
  createdAt?: string
  lastLogin?: string
}

export type UpdateMePayload = Partial<Pick<UserProfile, 'name' | 'avatarUrl' | 'timezone' | 'language'>>
export type ChangePasswordPayload = { currentPassword: string; newPassword: string }

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

type ReqOpts = { skipErrorToast?: boolean }
const withOpts = (opts?: ReqOpts) => ({ headers: opts?.skipErrorToast ? { 'x-skip-error-toast': '1' } : undefined })

export const usersService = {
  async getMe(): Promise<UserProfile> {
    const res = await api.get('/users/me')
    return unwrap<UserProfile>(res)
  },
  async updateMe(payload: UpdateMePayload, opts?: ReqOpts): Promise<UserProfile> {
    const res = await api.put('/users/me', payload, withOpts(opts))
    return unwrap<UserProfile>(res)
  },
  async changePassword(payload: ChangePasswordPayload, opts?: ReqOpts): Promise<{ success: boolean; message: string }> {
    const res = await api.put('/users/me/password', payload, withOpts(opts))
    return unwrap(res)
  },
  async deleteMe(password: string, opts?: ReqOpts): Promise<{ success: boolean; message: string }> {
    const res = await api.delete('/users/me', { data: { password }, ...(withOpts(opts)) })
    return unwrap(res)
  },
}
