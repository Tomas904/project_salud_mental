import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { authService } from '../services/auth'
import { usersService, type UserProfile } from '../services/users'

type User = UserProfile

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mh_token'))

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Traer perfil real; si falla, limpiar sesión
      usersService.getMe().then(setUser).catch(() => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('mh_token')
      })
    } else {
      // Sin token: estado desautenticado; no auto-login de desarrollo
    }
  }, [token])

  const refreshUser = async () => {
    const u = await usersService.getMe()
    setUser(u)
  }

  const login = async (email: string, password: string) => {
    const { token: t, user: u } = await authService.login({ email, password })
    setToken(t)
    setUser(u)
    localStorage.setItem('mh_token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const register = async (payload: { name: string; email: string; password: string }) => {
    const { token: t, user: u } = await authService.register(payload)
    setToken(t)
    setUser(u)
    localStorage.setItem('mh_token', t)
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const logout = () => {
    // Hacer best-effort logout
    authService.logout().catch(() => {})
    setToken(null)
    setUser(null)
    localStorage.removeItem('mh_token')
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de AuthProvider')
  return ctx
}
