import { NavLink } from 'react-router-dom'
import useAuth from '../../context/auth/useAuth.js'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/savings', label: 'Savings' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/settings', label: 'Settings' },
]

const Sidebar = () => {
  const { user, logoutUser } = useAuth()

  return (
    <div className="w-56 bg-white border-r border-gray-100 flex flex-col py-5 px-3">
      <div className="px-3 mb-8">
        <span className="text-base font-medium text-gray-900">FinTrack</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 pt-3 mt-3">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={logoutUser}
          className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Sidebar
