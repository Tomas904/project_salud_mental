import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

type User = {
  id?: string
  name?: string
  email: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mh_token'))

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // opcional: traer perfil real
      api.get('/me').then(res => setUser(res.data)).catch(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('mh_token')
      })
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: t, user: u } = res.data
    setToken(t)
    setUser(u)
    localStorage.setItem('mh_token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const register = async (payload: { name: string; email: string; password: string }) => {
    const res = await api.post('/auth/register', payload)
    const { token: t, user: u } = res.data
    setToken(t)
    setUser(u)
    localStorage.setItem('mh_token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('mh_token')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de AuthProvider')
  return ctx
}
