import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const StatCard = ({ label, value, sub, green }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-lg">
    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">{label}</p>
    <p className={`text-2xl font-medium ${green ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
      {value}
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
  </div>
)

const SavingsStats = ({ savings, savingsTotal, avgSaving }) => (
  <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
    <StatCard
      label="Total entries"
      value={savings.length}
      sub="auto-save events"
    />
    <StatCard
      label="Average saved"
      value={formatCurrency(avgSaving)}
      sub="per income cycle"
    />
    <StatCard
      label="Largest save"
      value={savings.length > 0 ? formatCurrency(Math.max(...savings.map(s => parseFloat(s.amount)))) : '0.00 DT'}
      sub="single auto-save"
      green
    />
    <StatCard
      label="Smallest save"
      value={savings.length > 0 ? formatCurrency(Math.min(...savings.map(s => parseFloat(s.amount)))) : '0.00 DT'}
      sub="single auto-save"
    />
  </div>
)

export default SavingsStats
