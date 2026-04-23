import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-lg">
    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">{label}</p>
    <p className={`text-xl font-medium ${color}`}>{value}</p>
  </div>
)

const AnalyticsStats = ({ totalIncome, totalExpenses, savingsTotal, savingsRate }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard label="Total income"   value={formatCurrency(totalIncome)}   color="text-gray-900 dark:text-gray-100" />
    <StatCard label="Total expenses" value={formatCurrency(totalExpenses)} color="text-red-500 dark:text-red-400" />
    <StatCard label="Total saved"    value={formatCurrency(savingsTotal)}  color="text-green-600 dark:text-green-400" />
    <StatCard label="Savings rate"   value={`${savingsRate}%`}             color="text-purple-600 dark:text-purple-400" />
  </div>
)

export default AnalyticsStats
