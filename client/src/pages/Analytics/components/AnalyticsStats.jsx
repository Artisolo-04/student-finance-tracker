import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { TrendingUp, TrendingDown, PiggyBank, Percent } from 'lucide-react'

const cards = (totalIncome, totalExpenses, savingsTotal, savingsRate) => [
  {
    label: 'Total income',
    value: formatCurrency(totalIncome),
    icon: TrendingUp,
    color: 'text-green-600 dark:text-green-400',
    border: 'border-b-green-500',
    iconStyle: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
  },
  {
    label: 'Total expenses',
    value: formatCurrency(totalExpenses),
    icon: TrendingDown,
    color: 'text-red-600 dark:text-red-400',
    border: 'border-b-red-500',
    iconStyle: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
  },
  {
    label: 'Total saved',
    value: formatCurrency(savingsTotal),
    icon: PiggyBank,
    color: 'text-purple-600 dark:text-purple-400',
    border: 'border-b-purple-500',
    iconStyle: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
  },
  {
    label: 'Savings rate',
    value: `${savingsRate}%`,
    icon: Percent,
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-b-amber-500',
    iconStyle: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
  },
]

const AnalyticsStats = ({ totalIncome, totalExpenses, savingsTotal, savingsRate }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {cards(totalIncome, totalExpenses, savingsTotal, savingsRate).map(
      ({ label, value, icon: Icon, color, border, iconStyle }, i) => (
        <div
          key={label}
          className={`
            bg-white dark:bg-[#0f0f1c]
            border border-zinc-200 dark:border-white/[0.07]
            border-b-2 ${border}
            rounded-2xl p-5 animate-fadeUp
          `}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
              {label}
            </p>

            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${iconStyle}`}
            >
              <Icon size={15} strokeWidth={1.8} />
            </div>
          </div>

          <p className={`text-xl font-semibold tracking-tight ${color}`}>
            {value}
          </p>
        </div>
      )
    )}
  </div>
)

export default AnalyticsStats
