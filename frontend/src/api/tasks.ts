import api from './axios'
import type { Task, TaskFormData, TaskFilters } from '../types/index'

export const tasksApi = {
  getTasks: (projectId: number, filters?: TaskFilters) =>
    api.get<Task[]>(`/projects/${projectId}/tasks/`, { params: filters }),

  getTask: (projectId: number, taskId: number) =>
    api.get<Task>(`/projects/${projectId}/tasks/${taskId}/`),

  createTask: (projectId: number, data: TaskFormData) =>
    api.post<Task>(`/projects/${projectId}/tasks/`, data),

  updateTask: (projectId: number, taskId: number, data: Partial<TaskFormData>) =>
    api.patch<Task>(`/projects/${projectId}/tasks/${taskId}/`, data),

  deleteTask: (projectId: number, taskId: number) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}/`),
}