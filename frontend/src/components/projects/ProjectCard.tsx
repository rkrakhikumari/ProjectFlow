import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreVertical, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { format } from 'date-fns'
import type { Project } from '../../types'

interface Props {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const progress =
    project.task_count > 0
      ? Math.round((project.completed_task_count / project.task_count) * 100)
      : 0

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col h-full hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all duration-200">
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {project.status === 'active' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <Circle size={10} className="fill-emerald-500" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold border border-zinc-200 dark:border-zinc-700">
              <CheckCircle2 size={10} />
              Completed
            </span>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden py-1 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(project) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Pencil size={13} /> Edit project
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(project) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title + description — clickable */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <h3 className="text-base font-bold text-zinc-900 dark:text-white leading-snug mb-1.5">
          {project.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Tasks</span>
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {project.completed_task_count}/{project.task_count}
          </span>
        </div>
        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-zinc-400 mt-2.5">
          Updated {format(new Date(project.updated_at), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  )
}