import { useEffect, useState } from 'react'

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1D9E75" opacity="0.15"/>
      <path d="M8 12l3 3 5-5" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#E24B4A" opacity="0.15"/>
      <path d="M15 9l-6 6M9 9l6 6" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 20h20L12 2z" fill="#EF9F27" opacity="0.15"/>
      <path d="M12 9v4M12 16v.5" stroke="#EF9F27" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#378ADD" opacity="0.15"/>
      <path d="M12 8v4M12 14v2" stroke="#378ADD" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
}

const styles = {
  success: 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800',
  error:   'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800',
  warning: 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800',
  info:    'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800',
}

const textStyles = {
  success: 'text-green-800 dark:text-green-300',
  error:   'text-red-800 dark:text-red-300',
  warning: 'text-amber-800 dark:text-amber-300',
  info:    'text-blue-800 dark:text-blue-300',
}

const progressStyles = {
  success: 'bg-green-400',
  error:   'bg-red-400',
  warning: 'bg-amber-400',
  info:    'bg-blue-400',
}

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))

    const duration = toast.duration || 4000
    const interval = 50
    const step = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(timer)
          return 0
        }
        return p - step
      })
    }, interval)

    const removeTimer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, duration)

    return () => {
      clearInterval(timer)
      clearTimeout(removeTimer)
    }
  }, [])

  return (
    <div
      className={`relative flex items-start gap-3 w-80 px-4 py-3 rounded-xl border shadow-lg overflow-hidden transition-all duration-300 ${
        styles[toast.type]
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <div className="mt-0.5 flex-shrink-0">{icons[toast.type]}</div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-medium ${textStyles[toast.type]}`}>
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        className="flex-shrink-0 text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 transition-colors mt-0.5"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-100 dark:bg-gray-700">
        <div
          className={`h-full transition-none ${progressStyles[toast.type]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

const Toast = ({ toasts, onRemove }) => {
  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

export default Toast
