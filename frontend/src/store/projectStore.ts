import { create } from 'zustand'
import type { Project, ProjectDetail, ProjectFilters } from '../types'

interface ProjectState {
  projects: Project[]
  currentProject: ProjectDetail | null
  totalCount: number
  filters: ProjectFilters
  isLoading: boolean
  error: string | null
  setProjects: (projects: Project[], count: number) => void
  setCurrentProject: (project: ProjectDetail | null) => void
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  removeProject: (id: number) => void
  setFilters: (filters: Partial<ProjectFilters>) => void
  setLoading: (v: boolean) => void
  setError: (err: string | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  totalCount: 0,
  filters: { page: 1 },
  isLoading: false,
  error: null,

  setProjects: (projects, count) =>
    set({ projects, totalCount: count, isLoading: false }),

  setCurrentProject: (project) => set({ currentProject: project }),

  addProject: (project) =>
    set((s) => ({ projects: [project, ...s.projects], totalCount: s.totalCount + 1 })),

  updateProject: (project) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === project.id ? project : p)),
      currentProject:
        s.currentProject?.id === project.id
          ? { ...s.currentProject, ...project }
          : s.currentProject,
    })),

  removeProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      totalCount: s.totalCount - 1,
    })),

  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters } })),

  setLoading: (v) => set({ isLoading: v }),
  setError: (err) => set({ error: err }),
}))