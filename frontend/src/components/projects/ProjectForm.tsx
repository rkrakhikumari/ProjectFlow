import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X } from 'lucide-react'
import type { Project, ProjectFormData } from '../../types'

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'Too short').max(200, 'Max 200 characters'),
  description: yup.string().max(1000, 'Max 1000 characters').default(''),
  status: yup.mixed<'active' | 'completed'>().oneOf(['active', 'completed']).required(),
})

interface Props {
  open: boolean
  project?: Project | null
  onSubmit: (data: ProjectFormData) => Promise<void>
  onClose: () => void
}

export default function ProjectForm({ open, project, onSubmit, onClose }: Props) {
  const isEdit = !!project

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { title: '', description: '', status: 'active' },
  })

  useEffect(() => {
    if (open) {
      reset(
        project
          ? { title: project.title, description: project.description, status: project.status }
          : { title: '', description: '', status: 'active' }
      )
    }
  }, [open, project, reset])

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            {isEdit ? 'Edit project' : 'New project'}
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
              Project title
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Website Redesign"
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
              rows={3}
              placeholder="Describe your project…"
              className={`${inputBase} resize-none ${errors.description ? 'border-red-400 dark:border-red-600' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={inputBase}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            />
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
              {isSubmitting ? 'Saving…' : isEdit ? 'Update project' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}