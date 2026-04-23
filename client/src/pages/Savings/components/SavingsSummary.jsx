import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const SavingsSummary = ({ savingsTotal, count }) => (
  <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
    <div className="w-28 h-28 rounded-full bg-green-50 dark:bg-green-900/20 border-4 border-green-100 dark:border-green-800 flex flex-col items-center justify-center mb-4">
      <span className="text-2xl">🐷</span>
      <span className="text-lg font-medium text-green-700 dark:text-green-300 mt-1">
        {formatCurrency(savingsTotal).split('.')[0]}
      </span>
      <span className="text-xs text-green-500 dark:text-green-400">DT</span>
    </div>
    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Total saved</p>
    <p className="text-2xl font-medium text-green-600 dark:text-green-400 mt-1">
      {formatCurrency(savingsTotal)}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      across {count} auto-saves
    </p>
  </div>
)

export default SavingsSummary
