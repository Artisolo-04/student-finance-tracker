import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const SavingsOverview = ({ savingsTotal, totalIncome, totalExpenses }) => (
  <div className="h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center justify-between shadow-sm">
    <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4 w-full">
      Savings overview
    </h2>

    <div className="flex flex-col items-center justify-center py-6 w-full gap-6">
      <div className="w-40 h-40 rounded-full bg-green-50 dark:bg-green-900/20 border-4 border-green-100 dark:border-green-800 flex flex-col items-center justify-center mb-4">
        <span className="text-4xl font-medium text-green-700 dark:text-green-300">
          {formatCurrency(savingsTotal).split('.')[0]}
        </span>
        <span className="text-xl text-green-500 dark:text-green-400">DT saved</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Savings accumulate automatically every time new income arrives
      </p>
    </div>

    <div className="border-t w-full border-gray-100 dark:border-gray-800 pt-4 space-y-2">
      <div className="flex justify-between text-basic">
        <span className="text-gray-400 dark:text-gray-500">Income this period</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {formatCurrency(totalIncome)}
        </span>
      </div>
      <div className="flex justify-between text-basic">
        <span className="text-gray-400 dark:text-gray-500">Expenses this period</span>
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          {formatCurrency(totalExpenses)}
        </span>
      </div>
      <div className="flex justify-between text-basic border-t border-gray-100 dark:border-gray-800 pt-2">
        <span className="text-gray-400 dark:text-gray-500">Savings rate</span>
        <span className="text-green-600 dark:text-green-400 font-medium">
          {totalIncome > 0
            ? `${Math.round((savingsTotal / totalIncome) * 100)}%`
            : '0%'}
        </span>
      </div>
    </div>
  </div>
)

export default SavingsOverview
