import api from './axios'
import type { Project, ProjectDetail, ProjectFormData, PaginatedResponse, ProjectFilters } from '../types'

export const projectsApi = {
  getProjects: (filters?: ProjectFilters) =>
    api.get<PaginatedResponse<Project>>('/projects/', { params: filters }),

  getProject: (id: number) =>
    api.get<ProjectDetail>(`/projects/${id}/`),

  createProject: (data: ProjectFormData) =>
    api.post<Project>('/projects/', data),

  updateProject: (id: number, data: Partial<ProjectFormData>) =>
    api.patch<Project>(`/projects/${id}/`, data),

  deleteProject: (id: number) =>
    api.delete(`/projects/${id}/`),
}