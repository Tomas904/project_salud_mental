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

export const usersService = {
  async getMe(): Promise<UserProfile> {
    const res = await api.get('/users/me')
    return unwrap<UserProfile>(res)
  },
  async updateMe(payload: UpdateMePayload): Promise<UserProfile> {
    const res = await api.put('/users/me', payload)
    return unwrap<UserProfile>(res)
  },
  async changePassword(payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> {
    const res = await api.put('/users/me/password', payload)
    return unwrap(res)
  },
  async deleteMe(password: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete('/users/me', { data: { password } })
    return unwrap(res)
  },
}
