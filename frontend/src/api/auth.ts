import api from './axios'
import type { AuthResponse, LoginFormData, RegisterFormData, User } from '../types/index'

export const authApi = {
  register: (data: RegisterFormData) =>
    api.post<AuthResponse>('/auth/register/', data),

  login: (data: LoginFormData) =>
    api.post<AuthResponse>('/auth/login/', data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }),

  getMe: () =>
    api.get<User>('/auth/me/'),

  updateMe: (data: Partial<Pick<User, 'first_name' | 'last_name' | 'email'>>) =>
    api.patch<User>('/auth/me/', data),
}