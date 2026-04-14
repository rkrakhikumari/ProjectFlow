import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X } from 'lucide-react'
import type { Task, TaskFormData } from '../../types'

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Too short').max(200, 'Max 200 characters'),
  description: yup.string().max(1000, 'Max 1000 characters').default(''),
  status: yup.mixed<'todo' | 'in-progress' | 'done'>().oneOf(['todo', 'in-progress', 'done']).required(),
  due_date: yup.string().default(''),
})

interface Props {
  open: boolean
  task?: Task | null
  onSubmit: (data: TaskFormData) => Promise<void>
  onClose: () => void
}

export default function TaskForm({ open, task, onSubmit, onClose }: Props) {
  const isEdit = !!task

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { title: '', description: '', status: 'todo', due_date: '' },
  })

  useEffect(() => {
    if (open) {
      reset(
        task
          ? { title: task.title, description: task.description, status: task.status, due_date: task.due_date ?? '' }
          : { title: '', description: '', status: 'todo', due_date: '' }
      )
    }
  }, [open, task, reset])

  if (!open) return null

  const inputBase =
    'w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Task title
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Design landing page"
              autoFocus
              className={`${inputBase} ${errors.title ? 'border-red-400 dark:border-red-600' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Optional details…"
              className={`${inputBase} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select {...field} className={inputBase}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                )}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Due date
              </label>
              <input
                {...register('due_date')}
                type="date"
                className={inputBase}
              />
            </div>
          </div>

          <div className="flex gap-2.5 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving…' : isEdit ? 'Update task' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}