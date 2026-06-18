import useFinance from '../../../context/finance/useFinance.js'
import { getBudgetStatus, formatCurrency } from '../../../context/finance/financeHelpers.js'

const BudgetProgress = () => {
  const { budgets, budgetSummary } = useFinance()

  if (!budgets.length) return null

  const allocationPercent = budgetSummary.income > 0
    ? Math.round((budgetSummary.allocated / budgetSummary.income) * 100)
    : 0

  return (
    <div className="w-full bg-white dark:bg-[#0f0f1c] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl p-5 flex flex-col animate-fadeUp">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Budget Goals</h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
            Current cycle · started {new Date(budgetSummary.cycle_start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">Unallocated</p>
          <p className={`text-sm font-bold mt-0.5 ${
            budgetSummary.unallocated === 0 ? 'text-emerald-500' : 'text-purple-500'
          }`}>
            {formatCurrency(budgetSummary.unallocated)}
          </p>
        </div>
      </div>

      {/* Overall allocation bar */}
      <div className="mb-4">
        <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-1.5 mb-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-500 bg-purple-500"
            style={{ width: `${Math.min(allocationPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            {allocationPercent}% of income allocated
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
            {formatCurrency(budgetSummary.allocated)} / {formatCurrency(budgetSummary.income)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 dark:border-white/[0.05] mb-4" />

      {/* Envelopes */}
      <div className="space-y-4">
        {budgets.map(b => {
          const { percent, level } = getBudgetStatus(b.spent, b.allocated)
          const width = Math.min(percent, 100)
          const barColor = level === 'danger' ? '#E24B4A'
            : level === 'warning' ? '#EF9F27'
            : '#1D9E75'

          return (
            <div key={b.category_id}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: barColor }} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{b.category_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {b.daily_remaining !== undefined && level !== 'danger' && (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                      ~{formatCurrency(b.daily_remaining)}/day
                    </span>
                  )}
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {formatCurrency(b.spent)} / {formatCurrency(b.allocated)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${width}%`, background: barColor }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                  {Math.round(width)}% used
                </span>
                {level === 'danger' && (
                  <span className="text-[10px] text-red-400">
                    Over by {formatCurrency(b.spent - b.allocated)}
                  </span>
                )}
                {level === 'warning' && (
                  <span className="text-[10px] text-amber-400">Approaching limit</span>
                )}
                {level === 'ok' && (
                  <span className="text-[10px] text-emerald-400">On track</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetProgress
