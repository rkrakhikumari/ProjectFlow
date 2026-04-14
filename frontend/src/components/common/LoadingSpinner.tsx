interface Props {
  message?: string
}

export default function LoadingSpinner({ message = 'Loading...' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  )
}