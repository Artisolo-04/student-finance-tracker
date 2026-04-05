import { useLocation } from 'react-router-dom'
import useFinance from '../../context/finance/useFinance.js'
import useUI from '../../context/ui/useUI.js'
import { isBalanceLow, formatCurrency } from '../../context/finance/financeHelpers.js'

const pageTitles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/savings': 'Savings',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

const ThemeSwitcher = ({ theme, setTheme }) => {
  const themes = [
    {
      value: 'light',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      value: 'dark',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      value: 'system',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2"
            stroke="currentColor" strokeWidth="2"/>
          <path d="M8 21h8M12 17v4"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
  ]

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.value.charAt(0).toUpperCase() + t.value.slice(1)}
          className={`relative w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${
            theme === t.value
              ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}

const Navbar = () => {
  const { pathname } = useLocation()
  const { balance } = useFinance()
  const { theme, setTheme } = useUI()
  const low = isBalanceLow(balance)

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-6 gap-3">

      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
        {pageTitles[pathname] || 'FinTrack'}
      </span>

      {low && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs px-3 py-1.5 rounded-full animate-pulse">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              fill="currentColor"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Balance low: {formatCurrency(balance)}
        </div>
      )}

      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-full">
        <span className="text-xs text-gray-400 dark:text-gray-500">Balance</span>
        <span className={`text-xs font-medium ${
          low
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-gray-900 dark:text-gray-100'
        }`}>
          {formatCurrency(balance)}
        </span>
      </div>

      <ThemeSwitcher theme={theme} setTheme={setTheme} />

    </div>
  )
}

export default Navbar
