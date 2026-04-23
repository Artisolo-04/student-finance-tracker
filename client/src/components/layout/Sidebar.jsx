import { NavLink } from 'react-router-dom'
import useAuth from '../../context/auth/useAuth.js'
import useUI from '../../context/ui/useUI.js'
import {
  RiDashboardLine,
  RiExchangeLine,
  RiSaveLine,
  RiPieChartLine,
  RiSettingsLine,
  RiLogoutBoxLine,
} from 'react-icons/ri'

const navItems = [
  { path: '/',             label: 'Dashboard',    icon: RiDashboardLine },
  { path: '/transactions', label: 'Transactions', icon: RiExchangeLine  },
  { path: '/savings',      label: 'Savings',      icon: RiSaveLine      },
  { path: '/analytics',    label: 'Analytics',    icon: RiPieChartLine  },
  { path: '/settings',     label: 'Settings',     icon: RiSettingsLine  },
]

const Tooltip = ({ label, show }) => (
  <div className={`
    absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
    bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium
    whitespace-nowrap pointer-events-none z-50
    transition-all duration-200
    ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'}
  `}>
    {label}
    {/* arrow */}
    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
  </div>
)

const NavItem = ({ path, label, icon: Icon, expanded }) => (
  <div className="relative group">
    <NavLink
      to={path}
      end={path === '/'}
      className={({ isActive }) =>
        `flex items-center rounded-lg text-sm transition-colors
        ${expanded ? 'gap-3 px-3 py-2.5' : 'py-2.5 w-full justify-center'}
        ${isActive
          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`
      }
    >
      <Icon size={18} className="shrink-0" />

      {/* label with fade */}
      <span className={`overflow-hidden whitespace-nowrap transition-all duration-300
        ${expanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
        {label}
      </span>
    </NavLink>

    {/* tooltip — only when collapsed */}
    {!expanded && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3
        px-2.5 py-1.5 rounded-lg z-50 pointer-events-none
        bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium whitespace-nowrap
        opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0
        transition-all duration-200">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
      </div>
    )}
  </div>
)

const Sidebar = () => {
  const { user, logoutUser } = useAuth()
  const { sidebarExpanded } = useUI()

  return (
  // outer div
  <div className={`${sidebarExpanded ? 'w-56' : 'w-16'} transition-all duration-300 h-full
    bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
    flex flex-col py-5 overflow-visible px-2`}  // ← px-2 instead of px-3
  >
      {/* Logo */}
      <div className={`mb-8 px-2 h-6 flex items-center overflow-hidden
        ${sidebarExpanded ? 'justify-start' : 'justify-center'}`}>
        <span className={`text-base font-bold text-purple-600 shrink-0 transition-all duration-300`}>F</span>
        <span className={`ml-0.5 text-base font-medium text-gray-900 dark:text-gray-100
          whitespace-nowrap transition-all duration-300
          ${sidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
          inTrack
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} expanded={sidebarExpanded} />
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">

        {/* user info fades out */}
        <div className={`px-2 py-2 overflow-hidden transition-all duration-300
          ${sidebarExpanded ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0'}`}>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.full_name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>

        {/* logout with tooltip */}
        <div className="relative group">
          <button
            onClick={logoutUser}
            className={`w-full py-2 text-sm text-red-500
              hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
              transition-colors flex items-center
              ${sidebarExpanded ? 'gap-3 px-3' : 'justify-center'}`}
          >
            <RiLogoutBoxLine size={18} className="shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300
              ${sidebarExpanded ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'}`}>
              Sign out
            </span>
          </button>

          {!sidebarExpanded && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3
              px-2.5 py-1.5 rounded-lg z-50 pointer-events-none
              bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium whitespace-nowrap
              opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0
              transition-all duration-200">
              Sign out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Sidebar
