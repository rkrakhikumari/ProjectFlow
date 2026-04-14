import { create } from 'zustand'
import type { User, AuthTokens } from '../types'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (user: User, tokens: AuthTokens) => void
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, tokens) => {
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    set({ user, tokens, isAuthenticated: true, isLoading: false })
  },

  setUser: (user) => set({ user }),

  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false })
  },

  setLoading: (v) => set({ isLoading: v }),
}))