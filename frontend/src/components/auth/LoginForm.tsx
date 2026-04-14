import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/useAuth'
import type { LoginFormData } from '../../types'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
})

export default function LoginForm() {
  const { login } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      await login(data)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">
        Welcome back
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Sign in to your account to continue
      </p>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 transition-colors ${
            errors.email
              ? 'border-red-400 dark:border-red-600'
              : 'border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-400 dark:focus-within:border-zinc-500'
          }`}>
            <Mail size={16} className="text-zinc-400 shrink-0" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className={`flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 transition-colors ${
            errors.password
              ? 'border-red-400 dark:border-red-600'
              : 'border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-400 dark:focus-within:border-zinc-500'
          }`}>
            <Lock size={16} className="text-zinc-400 shrink-0" />
            <input
              {...register('password')}
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-zinc-500 dark:text-zinc-400 mt-5 text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-zinc-900 dark:text-white hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}