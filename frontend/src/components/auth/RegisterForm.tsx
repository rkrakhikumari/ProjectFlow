import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/useAuth'
import type { RegisterFormData } from '../../types'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  first_name: yup.string().required('First name is required').min(2, 'Too short'),
  last_name: yup.string().required('Last name is required').min(2, 'Too short'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
  password2: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
})

export default function RegisterForm() {
  const { register: doRegister } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema) })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('')
      await doRegister(data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, string[]> } }
      const errData = e.response?.data
      if (errData && typeof errData === 'object') {
        const msgs = Object.values(errData).flat().join(' ')
        setError(msgs || 'Registration failed.')
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }

  const inputClass = (hasError: boolean) =>
    `flex items-center gap-2.5 border rounded-xl px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 transition-colors ${
      hasError
        ? 'border-red-400 dark:border-red-600'
        : 'border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-400 dark:focus-within:border-zinc-500'
    }`

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">
        Create account
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Get started with ProjectFlow today
      </p>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              First name
            </label>
            <div className={inputClass(!!errors.first_name)}>
              <User size={16} className="text-zinc-400 shrink-0" />
              <input
                {...register('first_name')}
                type="text"
                placeholder="John"
                className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
              />
            </div>
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              Last name
            </label>
            <div className={inputClass(!!errors.last_name)}>
              <User size={16} className="text-zinc-400 shrink-0" />
              <input
                {...register('last_name')}
                type="text"
                placeholder="Doe"
                className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
              />
            </div>
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1.5">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <div className={inputClass(!!errors.email)}>
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
          <div className={inputClass(!!errors.password)}>
            <Lock size={16} className="text-zinc-400 shrink-0" />
            <input
              {...register('password')}
              type={showPwd ? 'text' : 'password'}
              placeholder="Min. 8 characters"
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

        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Confirm password
          </label>
          <div className={inputClass(!!errors.password2)}>
            <Lock size={16} className="text-zinc-400 shrink-0" />
            <input
              {...register('password2')}
              type="password"
              placeholder="Re-enter password"
              className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 outline-none"
            />
          </div>
          {errors.password2 && (
            <p className="text-red-500 text-xs mt-1.5">{errors.password2.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-zinc-500 dark:text-zinc-400 mt-5 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}