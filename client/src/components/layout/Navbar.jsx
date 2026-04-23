import { useLocation } from 'react-router-dom'
import useFinance from '../../context/finance/useFinance.js'
import useUI from '../../context/ui/useUI.js'
import { isBalanceLow, formatCurrency } from '../../context/finance/financeHelpers.js'
import ThemeSwitcher from '../common/ThemeSwitcher.jsx'
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri'

const pageTitles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/savings': 'Savings',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

const Navbar = () => {
  const { pathname } = useLocation()
  const { balance } = useFinance()
  const { theme, setTheme, sidebarExpanded, toggleSidebar } = useUI()
  const low = isBalanceLow(balance)

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-3">

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="w-8 h-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hidden md:flex"
      >
        {sidebarExpanded
          ? <RiMenuFoldLine size={18} />
          : <RiMenuUnfoldLine size={18} />
        }
      </button>

      {/* Page title */}
      <span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
        {pageTitles[pathname] || 'FinTrack'}
      </span>

      {/* Balance low warning */}
      {low && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs px-3 py-1.5 rounded-full animate-pulse">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="currentColor"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Balance low: {formatCurrency(balance)}
        </div>
      )}

      {/* Balance pill */}
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-full">
        <span className="text-xs text-gray-400 dark:text-gray-500">Balance</span>
        <span className={`text-xs font-medium ${low ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {formatCurrency(balance)}
        </span>
      </div>

      <ThemeSwitcher theme={theme} setTheme={setTheme} />
    </div>
  )
}

export default Navbar
