import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/auth'

const schema = yup.object({
  first_name: yup.string().required('Required').min(2, 'Too short'),
  last_name:  yup.string().required('Required').min(2, 'Too short'),
  email:      yup.string().email().required(),
})

interface FormValues {
  first_name: string
  last_name: string
  email: string
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name:  user?.last_name  ?? '',
      email:      user?.email      ?? '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setApiError('')
      setSuccess(false)
      const res = await authApi.updateMe(data)
      setUser(res.data)
      setSuccess(true)
    } catch {
      setApiError('Failed to update profile. Please try again.')
    }
  }

  const initials = user
    ? (`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
        user.email[0].toUpperCase())
    : '?'

  const inputBase =
    'w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">Profile</h1>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-xl font-bold text-white dark:text-zinc-900 mb-3">
            {initials}
          </div>
          <p className="text-base font-semibold text-zinc-900 dark:text-white">{user?.full_name}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email}</p>
        </div>

        <div className="h-px bg-zinc-100 dark:bg-zinc-800 mb-6" />

        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl mb-5 text-sm">
            <CheckCircle2 size={16} className="shrink-0" />
            Profile updated successfully!
          </div>
        )}
        {apiError && (
          <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                First name
              </label>
              <input
                {...register('first_name')}
                className={`${inputBase} ${errors.first_name ? 'border-red-400' : ''}`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1.5">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Last name
              </label>
              <input
                {...register('last_name')}
                className={`${inputBase} ${errors.last_name ? 'border-red-400' : ''}`}
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1.5">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              {...register('email')}
              disabled
              className={inputBase}
            />
            <p className="text-xs text-zinc-400 mt-1.5">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}