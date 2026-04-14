import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const initials = user
    ? (`${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() ||
        user.email[0].toUpperCase())
    : '?'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 no-underline group"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white dark:text-zinc-900" />
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
            ProjectFlow
          </span>
        </Link>

        {user && (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-zinc-900 shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight">
                  {user.full_name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">
                  {user.email}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden py-1">
                <button
                  onClick={() => { setOpen(false); navigate('/profile') }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <User size={15} className="text-zinc-400" />
                  Profile
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                <button
                  onClick={() => { setOpen(false); logout() }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}