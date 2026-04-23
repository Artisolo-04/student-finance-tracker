import { Outlet, NavLink } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import Toast from '../common/Toast.jsx'
import useUI from '../../context/ui/useUI.js'
import {
  RiDashboardLine,
  RiExchangeLine,
  RiSaveLine,
  RiPieChartLine,
  RiSettingsLine,
} from 'react-icons/ri'

const navItems = [
  { path: '/',             label: 'Dashboard',    icon: RiDashboardLine },
  { path: '/transactions', label: 'Transactions', icon: RiExchangeLine  },
  { path: '/savings',      label: 'Savings',      icon: RiSaveLine      },
  { path: '/analytics',    label: 'Analytics',    icon: RiPieChartLine  },
  { path: '/settings',     label: 'Settings',     icon: RiSettingsLine  },
]

const AppShell = () => {
  const { toasts, removeToast } = useUI()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* sidebar — hidden completely on mobile */}
      <div className="hidden sm:block">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-8 py-8 pb-24 sm:pb-8">
          <Outlet />
        </main>
      </div>

      {/* bottom nav — mobile only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800
        flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default AppShell
