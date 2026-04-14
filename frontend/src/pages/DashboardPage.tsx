import { useCallback, useEffect, useState } from 'react'
import { Plus, FolderOpen, Search, SlidersHorizontal, X } from 'lucide-react'
import { projectsApi } from '../api/projects'
import { useProjectStore } from '../store/projectStore'
import { useAuthStore } from '../store/authStore'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectForm from '../components/projects/ProjectForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import type { Project, ProjectFormData, ProjectStatus } from '../types'

const PAGE_SIZE = 9

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest first' },
  { value: 'created_at', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
  { value: '-title', label: 'Title Z–A' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const {
    projects, totalCount, filters, isLoading, error,
    setProjects, addProject, updateProject, removeProject,
    setFilters, setLoading, setError,
  } = useProjectStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, unknown> = { page: filters.page ?? 1 }
      if (filters.search)   params.search   = filters.search
      if (filters.status)   params.status   = filters.status
      if (filters.ordering) params.ordering = filters.ordering
      const res = await projectsApi.getProjects(params as any)
      setProjects(res.data.results, res.data.count)
    } catch {
      setError('Failed to load projects.')
      setLoading(false)
    }
  }, [filters, setProjects, setLoading, setError])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleCreate = async (data: ProjectFormData) => {
    const res = await projectsApi.createProject(data)
    addProject(res.data)
    setFormOpen(false)
  }

  const handleUpdate = async (data: ProjectFormData) => {
    if (!editProject) return
    const res = await projectsApi.updateProject(editProject.id, data)
    updateProject(res.data)
    setEditProject(null)
  }

  const handleDelete = async () => {
    if (!deleteProject) return
    await projectsApi.deleteProject(deleteProject.id)
    removeProject(deleteProject.id)
    setDeleteProject(null)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const hasFilters = !!(filters.search || filters.status)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {greeting}, {user?.first_name || 'there'} 
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {totalCount} project{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5">
          <Search size={15} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search projects…"
            value={filters.search ?? ''}
            onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
          />
          {filters.search && (
            <button onClick={() => setFilters({ search: '', page: 1 })}>
              <X size={14} className="text-zinc-400 hover:text-zinc-600" />
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilters({ status: tab.value as ProjectStatus | '', page: 1 })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                (filters.status ?? '') === tab.value
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2">
          <SlidersHorizontal size={14} className="text-zinc-400 shrink-0" />
          <select
            value={filters.ordering ?? '-created_at'}
            onChange={(e) => setFilters({ ordering: e.target.value, page: 1 })}
            className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={() => setFilters({ search: '', status: undefined, page: 1 })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-52 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <FolderOpen size={28} className="text-zinc-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            {hasFilters ? 'No matching projects' : 'No projects yet'}
          </h3>
          <p className="text-sm text-zinc-400 mb-6">
            {hasFilters
              ? 'Try adjusting your filters'
              : 'Create your first project to get started'}
          </p>
          {!hasFilters && (
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors"
            >
              <Plus size={16} /> Create Project
            </button>
          )}
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={setEditProject}
              onDelete={setDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          <button
            onClick={() => setFilters({ page: (filters.page ?? 1) - 1 })}
            disabled={(filters.page ?? 1) <= 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters({ page: i + 1 })}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                (filters.page ?? 1) === i + 1
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setFilters({ page: (filters.page ?? 1) + 1 })}
            disabled={(filters.page ?? 1) >= totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modals */}
      <ProjectForm open={formOpen} onSubmit={handleCreate} onClose={() => setFormOpen(false)} />
      <ProjectForm open={!!editProject} project={editProject} onSubmit={handleUpdate} onClose={() => setEditProject(null)} />
      <ConfirmDialog
        open={!!deleteProject}
        title="Delete project"
        message={`Delete "${deleteProject?.title}" and all its tasks? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteProject(null)}
        confirmLabel="Delete"
      />
    </div>
  )
}