import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Pencil, Trash2, Calendar, Circle, Loader2, CheckCircle2 } from 'lucide-react'
import { format, isPast, parseISO } from 'date-fns'
import type { Task } from '../../types'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, newStatus: Task['status']) => void
}

type StatusKey = Task['status']

const STATUS_CONFIG: Record<StatusKey, { label: string; classes: string }> = {
  'todo':        { label: 'To do',       classes: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700' },
  'in-progress': { label: 'In progress', classes: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  'done':        { label: 'Done',        classes: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
}

const NEXT_STATUS: Record<StatusKey, StatusKey> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': 'todo',
}

const StatusIcon = ({ status }: { status: StatusKey }) => {
  if (status === 'todo') return <Circle size={11} />
  if (status === 'in-progress') return <Loader2 size={11} className="animate-spin" />
  return <CheckCircle2 size={11} />
}

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const cfg = STATUS_CONFIG[task.status]

  const isOverdue =
    task.due_date != null && task.status !== 'done' && isPast(parseISO(task.due_date))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
      {/* Status badge — click to cycle */}
      <button
        onClick={() => onStatusChange(task, NEXT_STATUS[task.status])}
        title={`Mark as ${NEXT_STATUS[task.status]}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0 mt-0.5 transition-colors hover:opacity-80 ${cfg.classes}`}
      >
        <StatusIcon status={task.status} />
        {cfg.label}
      </button>

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${
          task.status === 'done'
            ? 'line-through text-zinc-400 dark:text-zinc-600'
            : 'text-zinc-900 dark:text-white'
        }`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
            {task.description}
          </p>
        )}
      </div>

      {/* Due date */}
      {task.due_date && (
        <div className={`flex items-center gap-1 shrink-0 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-zinc-400'}`}>
          <Calendar size={12} />
          <span className={`text-xs ${isOverdue ? 'font-semibold' : ''}`}>
            {format(parseISO(task.due_date), 'MMM d')}
          </span>
        </div>
      )}

      {/* Menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden py-1 z-10">
            <button
              onClick={() => { setMenuOpen(false); onEdit(task) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDelete(task) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}