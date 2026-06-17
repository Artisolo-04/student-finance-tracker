import useFinance from '../../../context/finance/useFinance.js'
import { getBudgetStatus } from '../../../context/finance/financeHelpers.js'
import { formatCurrency } from '../../../context/finance/financeHelpers.js'

const BudgetProgress = () => {
  const { budgets } = useFinance()

  if (!budgets.length) return null

  return (
    <div className="w-full bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 flex flex-col animate-fadeUp">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Budget Goals</h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Monthly spending limits by category</p>
      </div>

      <div className="space-y-4">
        {budgets.map(b => {
          const { percent, level } = getBudgetStatus(b.spent, b.monthly_limit)
          const width = Math.min(percent, 100)
          const barColor = level === 'danger'
            ? '#E24B4A'
            : level === 'warning'
            ? '#EF9F27'
            : '#1D9E75'

          return (
            <div key={b.category_id}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: barColor }} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{b.category_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
                    {Math.round(Math.min(percent, 100))}%
                  </span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {formatCurrency(b.spent)} / {formatCurrency(b.monthly_limit)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${width}%`, background: barColor }}
                />
              </div>
              {level === 'danger' && (
                <p className="text-[10px] text-red-400 mt-1">
                  Over by {formatCurrency(b.spent - b.monthly_limit)}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetProgress
