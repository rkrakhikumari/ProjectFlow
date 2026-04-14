import { LayoutDashboard } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white mb-4">
            <LayoutDashboard size={22} className="text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            ProjectFlow
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your projects with clarity
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}