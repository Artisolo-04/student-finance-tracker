import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'
import { getBudgetStatus } from '../../../context/finance/financeHelpers.js'

const BudgetAlerts = ({ budgets }) => {
  if (!budgets.length) return null

  const warnings = budgets.filter(b => {
    const { level } = getBudgetStatus(b.spent, b.allocated)
    return level === 'warning' || level === 'danger'
  })

  if (!warnings.length) return null

  return (
    <div className="
      shrink-0 max-h-2/5 flex flex-col rounded-2xl p-4
      bg-white dark:bg-[#0f0f1c]
      border border-black/[0.07] dark:border-white/[0.07]
    ">
      <div className="mb-3 shrink-0">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Budget alerts
        </h2>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
          {warnings.length} {warnings.length === 1 ? 'category' : 'categories'} need attention
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
        {warnings.map(b => {
        const { percent, level } = getBudgetStatus(b.spent, b.allocated)
        const isDanger = level === 'danger'

        return (
          <div
            key={b.category_id}
            className={`flex flex-row justify-between gap-1.5 rounded-xl px-3.5 py-3 animate-fadeIn
              border ${isDanger
                ? 'border-red-500/20 bg-red-500/[0.07]'
                : 'border-amber-500/20 bg-amber-500/[0.07]'
              }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={13}
                strokeWidth={2}
                className={isDanger ? 'text-red-500 shrink-0' : 'text-amber-500 shrink-0'}
              />
              <p className={`text-xs font-medium leading-snug ${
                isDanger
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {isDanger
                  ? <><span className="font-bold">{b.category_name}</span> over by {formatCurrency(b.spent - b.allocated)}</>
                  : <><span className="font-bold">{b.category_name}</span> at {Math.round(percent)}% — {formatCurrency(b.remaining)} left</>
                }
              </p>
            </div>
            <Link
              to="/settings?tab=Budgets"
              className={`self-start text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all
                border ${isDanger
                  ? 'text-red-500 border-red-500/30 hover:border-red-400/50'
                  : 'text-amber-500 border-amber-500/30 hover:border-amber-400/50'
                }`}
            >
              Review →
            </Link>
          </div>
        )
        })}
      </div>
    </div>
  )
}

export default BudgetAlerts
