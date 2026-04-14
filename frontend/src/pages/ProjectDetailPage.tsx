import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {ArrowLeft, Plus, Pencil, Trash2, CheckCircle2,Loader2, Circle, ClipboardList, AlertCircle,} from 'lucide-react'
import { format } from 'date-fns'
import { projectsApi } from '../api/projects'
import { tasksApi } from '../api/tasks'
import { useProjectStore } from '../store/projectStore'
import type { ProjectDetail, Task, TaskFormData, TaskStatus } from '../types'
import TaskItem from '../components/tasks/TaskItem'
import TaskForm from '../components/tasks/TaskForm'
import ProjectForm from '../components/projects/ProjectForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'

const TASK_FILTER_TABS = [
  { value: '', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateProject, removeProject } = useProjectStore()

  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask, setDeleteTask] = useState<Task | null>(null)
  const [editProjectOpen, setEditProjectOpen] = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)

  const fetchProject = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await projectsApi.getProject(parseInt(id))
      setProject(res.data)
    } catch {
      setError('Project not found.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchProject() }, [fetchProject])

  const tasks = project?.tasks ?? []
  const filtered = tasks.filter((t) => !statusFilter || t.status === statusFilter)
  const counts = {
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done:       tasks.filter((t) => t.status === 'done').length,
  }
  const progress = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0

  const handleAddTask = async (data: TaskFormData) => {
    if (!project) return
    const res = await tasksApi.createTask(project.id, data)
    setProject((p) => p ? { ...p, tasks: [...p.tasks, res.data] } : p)
    setTaskFormOpen(false)
  }

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!project || !editTask) return
    const res = await tasksApi.updateTask(project.id, editTask.id, data)
    setProject((p) => p ? { ...p, tasks: p.tasks.map((t) => (t.id === editTask.id ? res.data : t)) } : p)
    setEditTask(null)
  }

  const handleDeleteTask = async () => {
    if (!project || !deleteTask) return
    await tasksApi.deleteTask(project.id, deleteTask.id)
    setProject((p) => p ? { ...p, tasks: p.tasks.filter((t) => t.id !== deleteTask.id) } : p)
    setDeleteTask(null)
  }

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (!project) return
    const res = await tasksApi.updateTask(project.id, task.id, {
      title: task.title,
      description: task.description,
      status: newStatus,
      due_date: task.due_date ?? '',
    })
    setProject((p) => p ? { ...p, tasks: p.tasks.map((t) => (t.id === task.id ? res.data : t)) } : p)
  }

  const handleUpdateProject = async (data: any) => {
    if (!project) return
    const res = await projectsApi.updateProject(project.id, data)
    setProject((p) => p ? { ...p, ...res.data } : p)
    updateProject(res.data)
    setEditProjectOpen(false)
  }

  const handleDeleteProject = async () => {
    if (!project) return
    await projectsApi.deleteProject(project.id)
    removeProject(project.id)
    navigate('/dashboard')
  }

  if (loading) return <LoadingSpinner message="Loading project…" />

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle size={16} className="shrink-0" />
          {error || 'Project not found'}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Project header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              {project.title}
            </h1>
            {project.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                <Circle size={9} className="fill-emerald-500" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
                <CheckCircle2 size={9} /> Completed
              </span>
            )}
          </div>
          {project.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
              {project.description}
            </p>
          )}
          <p className="text-xs text-zinc-400 mt-1.5">
            Created {format(new Date(project.created_at), 'MMMM d, yyyy')}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditProjectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => setDeleteProjectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: counts.total, icon: <ClipboardList size={15} />, color: 'text-zinc-500 dark:text-zinc-400' },
          { label: 'To do', value: counts.todo, icon: <Circle size={15} />, color: 'text-zinc-500 dark:text-zinc-400' },
          { label: 'In progress', value: counts.inProgress, icon: <Loader2 size={15} />, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Done', value: counts.done, icon: <CheckCircle2 size={15} />, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-center"
          >
            <div className={`flex items-center justify-center gap-1.5 mb-1 ${s.color}`}>
              {s.icon}
              <span className="text-xl font-bold text-zinc-900 dark:text-white">{s.value}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {counts.total > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Overall progress</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        {/* Tasks header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-wrap gap-3">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Tasks</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status filter tabs */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
              {TASK_FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value as TaskStatus | '')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === tab.value
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                  {tab.value === '' && counts.total > 0 && (
                    <span className="ml-1 text-zinc-400">({counts.total})</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setTaskFormOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
            >
              <Plus size={13} /> Add task
            </button>
          </div>
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
              <ClipboardList size={20} className="text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {statusFilter ? 'No tasks with this status' : 'No tasks yet — add your first one!'}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditTask}
                onDelete={setDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <TaskForm open={taskFormOpen} onSubmit={handleAddTask} onClose={() => setTaskFormOpen(false)} />
      <TaskForm open={!!editTask} task={editTask} onSubmit={handleUpdateTask} onClose={() => setEditTask(null)} />
      <ProjectForm open={editProjectOpen} project={project} onSubmit={handleUpdateProject} onClose={() => setEditProjectOpen(false)} />
      <ConfirmDialog
        open={!!deleteTask}
        title="Delete task"
        message={`Delete "${deleteTask?.title}"? This cannot be undone.`}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteTask(null)}
      />
      <ConfirmDialog
        open={deleteProjectOpen}
        title="Delete project"
        message={`Delete "${project.title}" and all its tasks? This cannot be undone.`}
        onConfirm={handleDeleteProject}
        onCancel={() => setDeleteProjectOpen(false)}
      />
    </div>
  )
}