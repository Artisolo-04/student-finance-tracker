import { useLocation } from 'react-router-dom'
import useFinance from '../../context/finance/useFinance.js'
import { isBalanceLow, formatCurrency } from '../../context/finance/financeHelpers.js'

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
  const low = isBalanceLow(balance)

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
      <span className="flex-1 text-sm font-medium text-gray-900">
        {pageTitles[pathname] || 'FinTrack'}
      </span>

      {low && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1.5 rounded-full">
          ⚠ Balance low: {formatCurrency(balance)}
        </div>
      )}

      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-xs px-3 py-1.5 rounded-full">
        <span className="text-gray-500">Balance</span>
        <span className={`font-medium ${low ? 'text-amber-600' : 'text-gray-900'}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  )
}

export default Navbar
