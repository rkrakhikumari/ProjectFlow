import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'
import type { LoginFormData, RegisterFormData } from '../types'

export const useAuth = () => {
  const navigate = useNavigate()
  const { setAuth, clearAuth, setLoading } = useAuthStore()

  const login = useCallback(
    async (data: LoginFormData) => {
      const res = await authApi.login(data)
      setAuth(res.data.user, res.data.tokens)
      navigate('/dashboard')
    },
    [setAuth, navigate]
  )

  const register = useCallback(
    async (data: RegisterFormData) => {
      const res = await authApi.register(data)
      setAuth(res.data.user, res.data.tokens)
      navigate('/dashboard')
    },
    [setAuth, navigate]
  )

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token')
    try {
      if (refresh) await authApi.logout(refresh)
    } finally {
      clearAuth()
      navigate('/login')
    }
  }, [clearAuth, navigate])

  const initAuth = useCallback(async () => {
    const access = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    if (!access || !refresh) {
      setLoading(false)
      return
    }
    try {
      const res = await authApi.getMe()
      setAuth(res.data, { access, refresh })
    } catch {
      clearAuth()
    }
  }, [setAuth, clearAuth, setLoading])

  return { login, register, logout, initAuth }
}