import { api } from './api'

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = { name: string; email: string; password: string }

export type AuthUser = {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  language?: string
}

export type AuthResponse = { user: AuthUser; token: string }

const unwrap = <T>(res: any): T => (res?.data?.data ?? res?.data)

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/login', payload)
    return unwrap<AuthResponse>(res)
  },
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post('/auth/register', payload)
    return unwrap<AuthResponse>(res)
  },
  async logout(): Promise<{ success: boolean; message?: string }> {
    const res = await api.post('/auth/logout')
    return unwrap(res)
  },
  async refreshToken(): Promise<{ token: string }> {
    const res = await api.post('/auth/refresh-token')
    return unwrap(res)
  },
}
