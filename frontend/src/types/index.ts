export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  created_at: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export type ProjectStatus = 'active' | 'completed'
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Project {
  id: number
  title: string
  description: string
  status: ProjectStatus
  owner: number
  owner_email: string
  task_count: number
  completed_task_count: number
  created_at: string
  updated_at: string
}

export interface ProjectDetail extends Project {
  tasks: Task[]
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  due_date: string | null
  project: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ProjectFilters {
  status?: ProjectStatus | ''
  search?: string
  page?: number
  ordering?: string
}

export interface TaskFilters {
  status?: TaskStatus | ''
}

export interface RegisterFormData {
  email: string
  first_name: string
  last_name: string
  password: string
  password2: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ProjectFormData {
  title: string
  description: string
  status: ProjectStatus
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  due_date: string
}